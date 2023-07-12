import { find, get, isEmpty, map } from "lodash";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { getNodeKey } from "@app/wallet/node-service";
import { KeyPair } from "@app/wallet/types";
import Cookies from "universal-cookie";
import {
  InfoMasterKey,
  ShareInfo,
  initialedShares,
  getOrSetInfoMasterKey,
  createShare,
  getInfoMasterKey,
  enabledMasterKeyMFA,
  sendMailPhrase,
  pssAllShares,
  insertTokenByMasterPublicKey,
  updateShareByPublicKey,
} from "@app/wallet/metadata";
import { decryptedMessage, encryptedMessage, encryptedMessageWithoutSign, formatPrivateKey, generateRandomPrivateKey, sharmirCombinePrivateKey, sharmirSplitPrivateKey } from "@app/wallet/algorithm";
import BN from "bn.js";
import { deviceInfo, wordsToHex } from "@app/utils";

export const useFetchWallet = () => {
  const cookies = new Cookies();
  const [infoMasterKey, setInfoMasterKey] = useSessionStorage<InfoMasterKey | null>("info-master-key", null);
  const [masterKey, setMasterKey] = useLocalStorage<KeyPair | null>("master-key", null);
  const [networkKey, setNetworkKey] = useLocalStorage<KeyPair | null>("network-key", null);
  const [deviceKey, setDeviceKey] = useLocalStorage<KeyPair | null>("device-key", null);

  // Get info master key
  const getInfoWallet = async (verifier: string, verifierId: string, idToken: string): Promise<{ error: string; info?: InfoMasterKey | null; networkKey?: KeyPair | null; success?: boolean }> => {
    try {
      const networkKey = await getNodeKey(verifier, verifierId, idToken);
      let { error, data: info } = await getOrSetInfoMasterKey(verifier, verifierId, networkKey);
      if (error) throw new Error(error);
      const { masterPrivateKey, masterPublicKey, networkPublicKey } = info as InfoMasterKey;
      // set session storage
      setNetworkKey(networkKey);

      setInfoMasterKey({
        ...info,
      } as InfoMasterKey);

      // First, generate master-key, and initial 2 shares by network key
      if (!info?.initialed) {
        const splits = sharmirSplitPrivateKey(Buffer.from(masterPrivateKey || "", "hex"));

        const share1 = await encryptedMessage(splits[0], new BN(networkKey.priKey, "hex"));
        const share2 = await encryptedMessage(splits[1], new BN(networkKey.priKey, "hex"));
        const shares = map([share1, share2], share => {
          return {
            masterPublicKey: masterPublicKey,
            publicKey: networkPublicKey,
            encryptedData: share.encryptedToString,
            type: "network-key" as ShareInfo["type"],
          };
        });
        const encrypted = await encryptedMessage(Buffer.from(Date.now().toString()), new BN(networkKey.priKey, "hex"));
        const createdShares = await initialedShares({
          masterPublicKey: masterPublicKey,
          networkPublicKey: encrypted.publicKey,
          shares,
          encryptedData: encrypted.encryptedToString,
          signature: encrypted.signature,
        });

        setInfoMasterKey({
          ...info,
          initialed: true,
          shares: createdShares.data,
        } as InfoMasterKey);
        info!.initialed = true;
        info!.shares = createdShares.data as ShareInfo[];
      }

      return {
        error: "",
        success: true,
        info,
        networkKey,
      };
    } catch (error) {
      return { error: get(error, "message", "Unknown"), info: null };
    }
  };

  const getInfoWalletByNetworkKey = async (networkKey: KeyPair): Promise<{ error: string; info?: InfoMasterKey | null }> => {
    try {
      let { error, data: info } = await getInfoMasterKey(networkKey!);
      if (error) throw new Error(error);
      setInfoMasterKey(info);
      return {
        error: "",
        info,
      };
    } catch (error) {
      return { error: get(error, "message", "Unknown"), info: null };
    }
  };

  /**
   * TODO: Using session storage error because it async
   * @param infoMasterKey
   * @returns
   */
  const fetchMasterKey = async (infoMasterKey: InfoMasterKey, networkKey: KeyPair): Promise<{ error?: string; success?: boolean; mfa?: boolean; newDeviceKey?: KeyPair }> => {
    try {
      if (isEmpty(networkKey)) {
        throw new Error("Please initial network key before");
      }
      if (isEmpty(infoMasterKey)) {
        throw new Error("Please initial master key before");
      }
      const { mfa, initialed, shares } = infoMasterKey as InfoMasterKey;
      if (!initialed) {
        throw new Error("Please initial shares of master key before");
      }

      // Always get from device first
      if (!isEmpty(deviceKey)) {
        const deviceShare = shares?.find(share => {
          return share.publicKey.toLowerCase().padStart(130, "0") === deviceKey.pubKey?.padStart(130, "0") && share.type === "device";
        });
        if (isEmpty(deviceShare)) {
          setDeviceKey(null);
          if (mfa) {
            return { error: "", mfa: true, success: false };
          }
          throw new Error("Device share not existed");
        }
        const networkShare = shares?.find(share => {
          return share.publicKey.toLowerCase().padStart(130, "0") === networkKey.pubKey?.padStart(130, "0") && share.type === "network-key";
        });
        if (isEmpty(networkShare)) {
          throw new Error("Network share not existed");
        }

        // Set private keys
        deviceShare.priKey = deviceKey.priKey;
        networkShare.priKey = networkKey.priKey;

        const decryptedShares = await Promise.all(
          [networkShare, deviceShare].map(async elm => {
            const data = await decryptedMessage(new BN(elm.priKey || "", "hex"), elm?.shareData ?? ({} as any));
            return data as Buffer;
          })
        );
        const masterKey = sharmirCombinePrivateKey(decryptedShares);
        const masterKeyFormatted = formatPrivateKey(new BN(masterKey, "hex"));
        if (masterKeyFormatted.pubKey?.toLowerCase() !== infoMasterKey.masterPublicKey.toLowerCase()) {
          throw new Error("Something went wrong, master public key not match with default");
        }
        setMasterKey(masterKeyFormatted);
        return { error: "", success: true, mfa: false };
      }

      if (!mfa) {
        const networkShares = shares?.filter(share => {
          return share.publicKey.toLowerCase().padStart(130, "0") === networkKey.pubKey?.padStart(130, "0") && share.type === "network-key";
        });
        if (networkShares && networkShares?.length < 2) {
          throw new Error("Cannot combine from network share");
        }
        const decryptedShares = await Promise.all(
          (networkShares || []).map(async elm => {
            return (await decryptedMessage(new BN(networkKey.priKey, "hex"), elm.shareData ?? ({} as any))) as Buffer;
          })
        );
        const masterKey = sharmirCombinePrivateKey(decryptedShares);
        const masterKeyFormatted = formatPrivateKey(new BN(masterKey, "hex"));
        if (masterKeyFormatted.pubKey?.toLowerCase() !== infoMasterKey.masterPublicKey.toLowerCase()) {
          throw new Error("Something went wrong, master public key not match with default");
        }
        setMasterKey(masterKeyFormatted);

        // Add device key share
        const deviceKey = formatPrivateKey(generateRandomPrivateKey());
        const deviceShare = await encryptedMessage(decryptedShares[1], new BN(deviceKey.priKey, "hex"));

        createShare({
          masterPublicKey: infoMasterKey.masterPublicKey,
          publicKey: deviceShare.publicKey,
          encryptedData: deviceShare.encryptedToString,
          signature: deviceShare.signature,
          type: "device",
          deviceInfo: await deviceInfo(),
        });
        setDeviceKey(deviceKey);
        //  cookies.set("masterKey", masterKeyFormatted.ethAddress, { path: "/" });

        return { error: "", success: true, mfa: false };
      }

      // Case if user enable MFA
      const newDeviceKey = formatPrivateKey(generateRandomPrivateKey());
      // Create new device and sent to server push notification
      createShare({
        masterPublicKey: infoMasterKey.masterPublicKey,
        publicKey: newDeviceKey.pubKey!,
        type: "device",
        deviceInfo: await deviceInfo(),
      });
      setDeviceKey(newDeviceKey);

      return { error: "", success: true, mfa: true, newDeviceKey: newDeviceKey };
    } catch (error) {
      setMasterKey(null);
      setDeviceKey(null);
      setNetworkKey(null);
      return { error: get(error, "message") };
    }
  };

  const fetchMasterKeyWithPhrase = async (phrase: string) => {
    try {
      if (isEmpty(infoMasterKey)) {
        throw new Error("Please initial master key before");
      }
      if (!infoMasterKey.mfa) {
        throw new Error("Please enable mfa");
      }
      if (isEmpty(networkKey)) {
        throw new Error("Please initial network key before");
      }
      const { shares } = infoMasterKey;
      const networkShare = shares?.find(share => {
        return share.publicKey.toLowerCase().padStart(130, "0") === networkKey.pubKey?.padStart(130, "0") && share.type === "network-key";
      });
      if (isEmpty(networkShare)) {
        throw new Error("Network share not existed");
      }
      const recoveryKey = formatPrivateKey(new BN(wordsToHex(phrase), "hex"));
      const recoveryShare = shares?.find(share => {
        return share.publicKey.toLowerCase().padStart(130, "0") === recoveryKey.pubKey?.padStart(130, "0") && share.type === "recovery-phrase";
      });
      if (isEmpty(recoveryShare)) {
        throw new Error("Recovery share not existed");
      }
      // Set private keys
      networkShare.priKey = networkKey.priKey;
      recoveryShare.priKey = recoveryKey.priKey;

      const decryptedShares = await Promise.all(
        [networkShare, recoveryShare].map(async elm => {
          const data = await decryptedMessage(new BN(elm.priKey || "", "hex"), elm?.shareData ?? ({} as any));
          return data as Buffer;
        })
      );
      const masterKey = sharmirCombinePrivateKey(decryptedShares);
      const masterKeyFormatted = formatPrivateKey(new BN(masterKey, "hex"));
      if (masterKeyFormatted.pubKey?.toLowerCase() !== infoMasterKey.masterPublicKey.toLowerCase()) {
        throw new Error("Something went wrong, master public key not match with default");
      }
      setMasterKey(masterKeyFormatted);
      // set device
      // Add device key share
      const deviceKey = formatPrivateKey(generateRandomPrivateKey());
      const deviceShare = await encryptedMessage(decryptedShares[1], new BN(deviceKey.priKey, "hex"));

      await createShare({
        masterPublicKey: infoMasterKey.masterPublicKey,
        publicKey: deviceShare.publicKey,
        encryptedData: deviceShare.encryptedToString,
        signature: deviceShare.signature,
        type: "device",
        deviceInfo: await deviceInfo(),
      });
      setDeviceKey(deviceKey);
      cookies.set("masterKey", masterKeyFormatted.ethAddress, { path: "/" });

      return { error: "", success: true };
    } catch (error) {
      return { error: get(error, "message", "") };
    }
  };

  const fetchMasterKeyWithDevice = async (infoMasterKey: InfoMasterKey): Promise<{ error?: string; success?: boolean }> => {
    try {
      if (isEmpty(networkKey)) {
        throw new Error("Please initial network key before");
      }
      if (isEmpty(infoMasterKey)) {
        throw new Error("Please initial master key before");
      }
      const { mfa, initialed, shares } = infoMasterKey as InfoMasterKey;
      if (!initialed) {
        throw new Error("Please initial shares of master key before");
      }
      if (!mfa) {
        throw new Error("Please enable mfa");
      }

      if (!isEmpty(deviceKey)) {
        const deviceShare = shares?.find(share => {
          return share.publicKey.toLowerCase().padStart(130, "0") === deviceKey.pubKey?.padStart(130, "0") && share.type === "device";
        });
        if (isEmpty(deviceShare)) {
          throw new Error("Device share not existed");
        }
        const networkShare = shares?.find(share => {
          return share.publicKey.toLowerCase().padStart(130, "0") === networkKey.pubKey?.padStart(130, "0") && share.type === "network-key";
        });
        if (isEmpty(networkShare)) {
          throw new Error("Network share not existed");
        }

        // Set private keys
        deviceShare.priKey = deviceKey.priKey;
        networkShare.priKey = networkKey.priKey;

        const decryptedShares = await Promise.all(
          [networkShare, deviceShare].map(async elm => {
            const data = await decryptedMessage(new BN(elm.priKey || "", "hex"), elm?.shareData ?? ({} as any));
            return data as Buffer;
          })
        );
        const masterKey = sharmirCombinePrivateKey(decryptedShares);
        const masterKeyFormatted = formatPrivateKey(new BN(masterKey, "hex"));
        if (masterKeyFormatted.pubKey?.toLowerCase() !== infoMasterKey.masterPublicKey.toLowerCase()) {
          throw new Error("Something went wrong, master public key not match with default");
        }
        setMasterKey(masterKeyFormatted);
        cookies.set("masterKey", masterKeyFormatted.ethAddress, { path: "/" });
        return { error: "", success: true };
      }
      return { error: "Not found" };
    } catch (error) {
      return { error: get(error, "message", "") };
    }
  };

  const enableMFA = async (email: string, phrase: string): Promise<{ error: string; success?: boolean }> => {
    try {
      if (isEmpty(masterKey)) {
        throw new Error("Master key not found");
      }
      if (isEmpty(infoMasterKey)) {
        throw new Error("Please initial master key before");
      }
      if (infoMasterKey.mfa) {
        throw new Error("Enabled mfa");
      }
      if (isEmpty(networkKey)) {
        throw new Error("Please initial network key before");
      }
      const { priKey: masterPrivateKey, pubKey: masterPublicKey } = masterKey;
      // Split shares
      const splits = sharmirSplitPrivateKey(Buffer.from(masterPrivateKey, "hex"));
      // Encrypted by network key
      const networkShare = await encryptedMessage(splits[0], new BN(networkKey.priKey, "hex"));
      // Encrypted by device key
      const deviceKey = formatPrivateKey(generateRandomPrivateKey());
      const deviceShare = await encryptedMessage(splits[1], new BN(deviceKey.priKey, "hex"));
      // Encrypted by recovery key
      // Generate 24 words
      // const recoveryKey = formatPrivateKey(generateRandomPrivateKey());
      const recoveryKey = formatPrivateKey(new BN(wordsToHex(phrase), "hex"));
      // const phrase = hexToWords(recoveryKey.priKey);
      const recoveryShare = await encryptedMessage(splits[1], new BN(recoveryKey.priKey, "hex"));

      const shares = [
        {
          masterPublicKey: masterPublicKey,
          publicKey: networkShare.publicKey,
          encryptedData: networkShare.encryptedToString,
          type: "network-key" as ShareInfo["type"],
        },
        {
          masterPublicKey: masterPublicKey,
          publicKey: deviceShare.publicKey,
          encryptedData: deviceShare.encryptedToString,
          deviceInfo: await deviceInfo(),
          type: "device" as ShareInfo["type"],
        },
        {
          masterPublicKey: masterPublicKey,
          publicKey: recoveryShare.publicKey,
          encryptedData: recoveryShare.encryptedToString,
          email,
          type: "recovery-phrase" as ShareInfo["type"],
        },
      ];
      const encrypted = await encryptedMessage(Buffer.from(Date.now().toString()), new BN(networkKey.priKey, "hex"));
      const enabledMFA = await enabledMasterKeyMFA({
        masterPublicKey: masterPublicKey!,
        networkPublicKey: encrypted.publicKey,
        encryptedData: encrypted.encryptedToString,
        signature: encrypted.signature,
        networkShare: shares[0],
        deviceShare: shares[1],
        recoveryShare: shares[2],
      });
      if (enabledMFA.error) {
        throw new Error(enabledMFA.error);
      }
      // Send mail
      setDeviceKey(deviceKey);
      // await sendMailPhrase({
      //   email,
      //   phrase,
      // });

      return { error: "", success: enabledMFA.data };
    } catch (error) {
      return { error: get(error, "message", "") };
    }
  };

  const changeRecoveryEmail = async (email: string, phrase: string): Promise<{ error?: string; success?: boolean }> => {
    try {
      if (isEmpty(masterKey)) {
        throw new Error("Master key not found");
      }
      if (isEmpty(infoMasterKey)) {
        throw new Error("Please initial master key before");
      }
      if (isEmpty(networkKey)) {
        throw new Error("Please initial network key before");
      }
      const { priKey: masterPrivateKey, pubKey: masterPublicKey } = masterKey;
      // Split shares
      const shares: {
        device?: Partial<ShareInfo>[];
        "network-key"?: Partial<ShareInfo>;
        "recovery-phrase"?: Partial<ShareInfo>;
      } = {};
      const splits = sharmirSplitPrivateKey(Buffer.from(masterPrivateKey, "hex"));

      const recoveryKey = formatPrivateKey(new BN(wordsToHex(phrase.trim()), "hex"));
      // const phrase = hexToWords(recoveryKey.priKey);

      await Promise.all(
        (infoMasterKey?.shares || []).map(async share => {
          const { type } = share;
          if (type === "network-key") {
            const shareEncrypted = await encryptedMessageWithoutSign(splits[0], new BN(share.publicKey, "hex"));
            shares["network-key"] = {
              ...share,
              encryptedData: shareEncrypted.encryptedToString,
            };
          }
          if (type === "recovery-phrase") {
            const shareEncrypted = await encryptedMessageWithoutSign(splits[1], new BN(recoveryKey.pubKey!, "hex"));
            shares["recovery-phrase"] = {
              ...share,
              email,
              publicKey: recoveryKey.pubKey!,
              encryptedData: shareEncrypted.encryptedToString,
            };
          }
          if (type === "device") {
            const shareEncrypted = await encryptedMessageWithoutSign(splits[1], new BN(share.publicKey, "hex"));
            shares.device = (shares.device || []).concat({
              ...share,
              encryptedData: shareEncrypted.encryptedToString,
            });
          }
        })
      );

      const encrypted = await encryptedMessage(Buffer.from(Date.now().toString()), new BN(masterPrivateKey, "hex"));

      const pss = await pssAllShares({
        masterPublicKey: masterPublicKey!,
        networkPublicKey: encrypted.publicKey,
        encryptedData: encrypted.encryptedToString,
        signature: encrypted.signature,
        networkShare: shares["network-key"] || null,
        deviceShares: shares.device || [],
        recoveryShare: shares["recovery-phrase"] || {},
      });

      if (pss.error) {
        throw new Error(pss.error);
      }

      // Send mail
      await sendMailPhrase({
        email,
        phrase,
      });

      return { error: "" };
    } catch (error) {
      return { error: get(error, "message", "") };
    }
  };

  const removeDeviceShare = async (devicePubicKey: string): Promise<{ error?: string; success?: boolean }> => {
    try {
      if (isEmpty(masterKey)) {
        throw new Error("Master key not found");
      }
      if (isEmpty(infoMasterKey)) {
        throw new Error("Please initial master key before");
      }
      if (isEmpty(networkKey)) {
        throw new Error("Please initial network key before");
      }
      const { priKey: masterPrivateKey, pubKey: masterPublicKey } = masterKey;
      // Split shares
      const shares: {
        device?: Partial<ShareInfo>[];
        "network-key"?: Partial<ShareInfo>;
        "recovery-phrase"?: Partial<ShareInfo>;
      } = {};
      const splits = sharmirSplitPrivateKey(Buffer.from(masterPrivateKey, "hex"));

      await Promise.all(
        (infoMasterKey?.shares || []).map(async share => {
          const { type } = share;
          if (type === "network-key") {
            const shareEncrypted = await encryptedMessageWithoutSign(splits[0], new BN(share.publicKey, "hex"));
            shares["network-key"] = {
              ...share,
              encryptedData: shareEncrypted.encryptedToString,
            };
          }
          if (type === "recovery-phrase") {
            const shareEncrypted = await encryptedMessageWithoutSign(splits[1], new BN(share.publicKey, "hex"));
            shares["recovery-phrase"] = {
              ...share,
              encryptedData: shareEncrypted.encryptedToString,
            };
          }
          if (type === "device") {
            // Not add devicePubicKey to array
            if (devicePubicKey === share.publicKey) {
              return;
            }

            const shareEncrypted = await encryptedMessageWithoutSign(splits[1], new BN(share.publicKey, "hex"));
            shares.device = (shares.device || []).concat({
              ...share,
              encryptedData: shareEncrypted.encryptedToString,
            });
          }
        })
      );

      const encrypted = await encryptedMessage(Buffer.from(Date.now().toString()), new BN(masterPrivateKey, "hex"));

      const pss = await pssAllShares({
        masterPublicKey: masterPublicKey!,
        networkPublicKey: encrypted.publicKey,
        encryptedData: encrypted.encryptedToString,
        signature: encrypted.signature,
        networkShare: shares["network-key"] || null,
        deviceShares: shares.device || [],
        ...(shares["recovery-phrase"] ? { recoveryShare: shares["recovery-phrase"] } : null),
      });

      if (pss.error) {
        throw new Error(pss.error);
      }

      return { error: "" };
    } catch (error) {
      return { error: get(error, "message", "") };
    }
  };

  const insertTokenFCM = async (token: string, infoMasterKey: InfoMasterKey): Promise<{ error?: string; success?: boolean }> => {
    try {
      if (isEmpty(infoMasterKey)) {
        throw new Error("Please initial master key before");
      }
      const { error, data } = await insertTokenByMasterPublicKey({ token, masterPublicKey: infoMasterKey.masterPublicKey });
      if (error) {
        throw new Error(error);
      }
      return { success: data };
    } catch (error) {
      return { error: get(error, "message", "") };
    }
  };

  /**
   *
   * @param publicKey device
   * @returns
   */
  const updateShareForPublicKey = async (infoMasterKey: InfoMasterKey, shareInfo: ShareInfo): Promise<{ error?: string; success?: boolean }> => {
    try {
      if (isEmpty(infoMasterKey)) {
        throw new Error("Please initial master key before");
      }
      if (isEmpty(deviceKey)) {
        throw new Error("Device key not found");
      }
      const findShare = find(infoMasterKey.shares, share => {
        return share.publicKey.toLowerCase().padStart(130, "0") === deviceKey.pubKey?.padStart(130, "0") && share.type === "device";
      });
      if (!findShare) {
        throw new Error("Share device key not found");
      }
      const shareDecrypted = (await decryptedMessage(new BN(deviceKey.priKey, "hex"), findShare?.shareData ?? ({} as any))) as Buffer;
      const shareEncrypted = await encryptedMessageWithoutSign(shareDecrypted, new BN(shareInfo.publicKey, "hex"));
      const { error, data } = await updateShareByPublicKey({ type: shareInfo.type, publicKey: shareEncrypted.publicKey, encryptedData: shareEncrypted.encryptedToString });
      if (error) {
        throw new Error(error);
      }
      return { success: data };
    } catch (error) {
      return { error: get(error, "message", "") };
    }
  };

  return {
    getInfoWallet,
    getInfoWalletByNetworkKey,
    fetchMasterKey,
    fetchMasterKeyWithDevice,
    enableMFA,
    fetchMasterKeyWithPhrase,
    changeRecoveryEmail,
    removeDeviceShare,
    insertTokenFCM,
    updateShareForPublicKey,
  };
};
