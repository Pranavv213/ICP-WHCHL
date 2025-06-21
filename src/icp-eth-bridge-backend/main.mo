import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";

persistent actor Whoami {
  // To store attendees and registrations
  stable var attendees : [(Nat, Principal)] = [];
  stable var registrations : [Principal] = [];
  stable var liquidity : (Nat, Nat) = (0, 0);
  stable var totalSupply : Nat = 1000;

  public query (message) func whoami() : async Principal {
    message.caller;
  };

  public func bookEvents(eventId : Nat) : async Text {
    // For now, just confirm booking.
    let caller = Principal.fromText("aaaaa-aa"); // Normally: message.caller
    attendees := Array.append(attendees, [(eventId, caller)]);
    "Event booked: #" # Nat.toText(eventId) # " by " # Principal.toText(caller)
  };

  public func attend(eventId : Nat) : async Bool {
    let canAttend = eventId % 2 == 0;
    if (canAttend) {
      let caller = Principal.fromText("aaaaa-aa"); // Normally: message.caller
      attendees := Array.append(attendees, [(eventId, caller)]);
    };
    canAttend
  };

  public func getAttendeesById(eventId : Nat) : async [Principal] {
    let filtered = Array.filter<(Nat, Principal)>(attendees, func ((eid, user)) { eid == eventId });
    Array.map<(Nat, Principal), Principal>(filtered, func ((eid, user)) { user })
  };

  public func register(user : Principal) : async Text {
    if (Array.find<Principal>(registrations, func (u) { u == user }) == null) {
      registrations := Array.append(registrations, [user]);
      "Registered: " # Principal.toText(user)
    } else {
      "Already registered: " # Principal.toText(user)
    }
  };

  public func getEventById(eventId : Nat) : async Text {
    switch (eventId) {
      case (1) { "Hackathon 2025" };
      case (2) { "AI + Web3 Bootcamp" };
      case (3) { "NFT Art Fest" };
      case (_) { "Event #" # Nat.toText(eventId) };
    }
  };

  public func getSupply() : async Nat {
    totalSupply
  };

  public func getName() : async Text {
    "SampleToken"
  };

  public func getSymbol() : async Text {
    "SMP"
  };

  public func premint(amount : Nat) : async Nat {
    totalSupply += amount;
    totalSupply
  };

  public func presaleDeposit(amount : Nat) : async Bool {
    if (amount > 0) {
      totalSupply += amount; // Assume added to supply
      true
    } else {
      false
    }
  };

  public func presaleBuy(amount : Nat) : async Text {
    if (amount <= 0) {
      "Invalid amount."
    } else if (amount > totalSupply) {
      "Not enough tokens in supply."
    } else {
      totalSupply -= amount;
      "Bought " # Nat.toText(amount) # " tokens in presale"
    }
  };

  public func swapToken(amount : Nat) : async Nat {
    let rate = 2; // Swap rate 1:2
    let received = amount * rate;
    received
  };

  public func addLiquidity(tokenA : Nat, tokenB : Nat) : async Text {
    liquidity := (liquidity.0 + tokenA, liquidity.1 + tokenB);
    "Liquidity added: " # Nat.toText(tokenA) # " and " # Nat.toText(tokenB)
  };

  public func getLiquidityPair() : async (Nat, Nat) {
    liquidity
  };
};
