import React from "react";
import { ethers } from "ethers";

const Testsolcode = () => {
  const createEvent = async () => {
    try {
      // 1️⃣ Check if MetaMask is available
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask!");
        return;
      }

      // 2️⃣ Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // 3️⃣ Create provider and signer from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // 4️⃣ Contract setup
      const CONTRACT_ADDRESS = "0xCc84fAa4B72B4263b4Ca845D026d514e25AF5D0E";
      const contractABI = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "string",
              "name": "eventId",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "attendeeEmail",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "hasAttended",
              "type": "bool"
            }
          ],
          "name": "AttendanceMarked",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_eventId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_creatorEmail",
              "type": "string"
            }
          ],
          "name": "createEvent",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "string",
              "name": "eventId",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "creatorEmail",
              "type": "string"
            }
          ],
          "name": "EventCreated",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_eventId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_attendeeEmail",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "_status",
              "type": "bool"
            }
          ],
          "name": "markAttendance",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_eventId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_attendeeEmail",
              "type": "string"
            }
          ],
          "name": "register",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "string",
              "name": "eventId",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "attendeeEmail",
              "type": "string"
            }
          ],
          "name": "Registered",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "name": "events",
          "outputs": [
            {
              "internalType": "string",
              "name": "creatorEmail",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "exists",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_eventId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_attendeeEmail",
              "type": "string"
            }
          ],
          "name": "getAttendee",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_eventId",
              "type": "string"
            }
          ],
          "name": "getAttendeeEmails",
          "outputs": [
            {
              "internalType": "string[]",
              "name": "",
              "type": "string[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_eventId",
              "type": "string"
            }
          ],
          "name": "getCreatorEmail",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      // 5️⃣ Send transaction
      const tx = await contract.createEvent("eventId12", "creato123r@example.com");
      console.log("Transaction sent! Waiting for confirmation...");

      await tx.wait();
      console.log("Transaction confirmed! Hash:", tx.hash);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Event Manager</h1>
      <button onClick={createEvent}>Create Event (MetaMask)</button>
    </div>
  );
};

export default Testsolcode;
