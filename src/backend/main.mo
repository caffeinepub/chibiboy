import Map "mo:core/Map";
import Principal "mo:core/Principal";

actor {
  let usersMap = Map.empty<Principal, Bool>();

  public shared ({ caller }) func acceptTerms() : async () {
    usersMap.add(caller, true);
  };

  public query ({ caller }) func hasAcceptedTerms() : async Bool {
    usersMap.containsKey(caller);
  };
};
