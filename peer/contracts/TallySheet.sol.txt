pragma solidity ^0.4.24;

contract Home{
    TallySheet[] tallySheets;
    uint public currentTallySheet;
    uint public numberOfTallySheets;

    constructor() public{
        currentTallySheet = 0;
        numberOfTallySheets = 0;
    }

    function changeCurrentTallySheet(uint _value) public {
        currentTallySheet = _value;
    }

    function getTallySheetStats() public view returns(bytes32[] name, uint[] stand) {
        name = tallySheets[currentTallySheet].getAllAccounts();
        stand = new uint[](name.length);
        for(uint i = 0; i < name.length; i++){
            stand[i] = tallySheets[currentTallySheet-1].getKontoStand(name[i]);
        }
    }

    function getStartDatum() public view returns(uint) {
        return tallySheets[currentTallySheet-1].getStartDatum();
    }

    function newTallySheet() public{
        tallySheets.push(new TallySheet());
        currentTallySheet++;
        numberOfTallySheets++;
    }

    function newAccount(bytes32 _name) public {
        tallySheets[currentTallySheet-1].newAccount(_name);
    }

    function undoLastTransaction() public {
        tallySheets[currentTallySheet-1].undoLastTransaction();
    }

    function getLastTransaction() public view returns (string, uint){
        tallySheets[currentTallySheet-1].getLastTransaction();
    }

    function getAllAccounts() public view returns(bytes32[]) {
        tallySheets[currentTallySheet-1].getAllAccounts();
    }

    function buySomething(uint _value, bytes32 _name) public{
        tallySheets[currentTallySheet-1].buySomething(_value, _name);
    }

    function getKontoStand(bytes32 _name) public view returns(uint) {
        return tallySheets[currentTallySheet-1].getKontoStand(_name);
    }

}

contract TallySheet{
    mapping (bytes32 => uint) kontoStand;
    bytes32[] accounts;
    uint startDatum;

    constructor(){
        startDatum = now;
    }

    struct LastTransaction{
        uint _value;
        bytes32 _name;
        bool _undo;
    }

    LastTransaction lastTransaction;

    function newAccount(bytes32 _name) public{
        accounts.push(_name);
    }

    function getStartDatum() public view returns(uint){
        return startDatum;
    }

    function logLastTransaction(bytes32 _name, uint _value) public{
        lastTransaction._value = _value;
        lastTransaction._name = _name;
        lastTransaction._undo = true;
    }

    function undoLastTransaction() public {
        require(lastTransaction._undo);
        kontoStand[lastTransaction._name] -= lastTransaction._value;
        lastTransaction._undo = false;
    }

    function getLastTransaction() public view returns (string, uint){
        (lastTransaction._name, lastTransaction._value);
    }

    function getAllAccounts() public view returns(bytes32[]) {
        return accounts;
    }

    function buySomething(uint _value, bytes32 _name) public{
        kontoStand[_name] += _value;
        logLastTransaction(_name, _value);
    }

    function getKontoStand(bytes32 _name) public view returns(uint) {
        return kontoStand[_name];
    }

    function stringToBytes32(string memory source) public returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

}
