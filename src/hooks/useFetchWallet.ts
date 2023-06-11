import { get, isEmpty, map } from "lodash";
import { useSessionStorage } from "usehooks-ts";
import { getNodeKey } from "@app/wallet/node-service";
import { KeyPair } from "@app/wallet/types";
import { InfoMasterKey, ShareInfo, initialedShares, getOrSetInfoMasterKey, createShare } from "@app/wallet/metadata";
import { decryptedMessage, encryptedMessage, formatPrivateKey, generateRandomPrivateKey, sharmirCombinePrivateKey, sharmirSplitPrivateKey } from "@app/wallet/algorithm";
import BN from "bn.js";
import { deviceInfo } from "@app/utils";
import { useState } from "react";

export const useFetchWallet = () => {
  const [infoMasterKey, setInfoMasterKey] = useSessionStorage<InfoMasterKey | null>("info-master-key", null);
  const [masterKey, setMasterKey] = useSessionStorage<KeyPair | null>("master-key", null);
  const [networkKey, setNetworkKey] = useSessionStorage<KeyPair | null>("network-key", null);
  const [deviceKey, setDeviceKey] = useSessionStorage<KeyPair | null>("device-key", null);

  // Get info master key
  const getInfoWallet = async (verifier: string, verifierId: string, idToken: string): Promise<{ error: string; info?: InfoMasterKey | null; networkKey?: KeyPair | null }> => {
    try {
      const networkKey = await getNodeKey(verifier, verifierId, idToken);
      let { error, data: info } = await getOrSetInfoMasterKey(verifier, verifierId, networkKey);
      if (error) throw new Error(error);
      const { masterPrivateKey, masterPublicKey, networkPublicKey } = info as InfoMasterKey;
      // set session storage
      setNetworkKey(networkKey);
      setInfoMasterKey(
        () =>
          ({
            ...info,
          } as InfoMasterKey)
      );

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

        setInfoMasterKey(
          () =>
            ({
              ...info,
              shares: createdShares.data,
            } as InfoMasterKey)
        );
        info!.shares = createdShares.data as ShareInfo[];
      }

      return {
        error: "",
        info,
        networkKey,
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
  const fetchMasterKey = async (infoMasterKey: InfoMasterKey, networkKey: KeyPair): Promise<{ error?: string }> => {
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
      }
      return { error: "" };
    } catch (error) {
      setMasterKey(null);
      setDeviceKey(null);
      setNetworkKey(null);
      return { error: get(error, "message") };
    }
  };

  return { getInfoWallet, fetchMasterKey };
};