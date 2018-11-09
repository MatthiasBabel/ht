pragma solidity ^0.4.24;

contract Home {
    uint interval = 600;
    address owner;
    address[] prosumerAddress;
    Storage[] storages;
    mapping(address => Prosumer) prosumer;
    mapping(uint => mapping(uint => Storage)) storageGrid;

    constructor() public {
        owner = msg.sender;
    }

    //setter
    function useCapaInNextIntervalFromXY(uint _x, uint _y, uint _value) public returns(uint capaLeft) {
        return storageGrid[_x][_y].useCapaInNextInterval(_value);
    }

    function useCapaInNextIntervalForXY(uint _x, uint _y, uint _value) public {
        uint index = 0;
        uint shortest = uint(int(-1));
        uint valueLeft = _value;
        uint j = 0;
        while(j < storages.length && valueLeft > 0){
        //Suchen der kürzesten Distanz
            for(uint i = 0; i < storages.length; i++){
                uint x = 0;
                uint y = 0;
                uint len = 0;
                (x, y) = storages[i].getXY();
                //Abs
                if(_x > x)
                    len = _x - x;
                else
                    len = x - _x;
                if(_y > y)
                    len += _y - y;
                else
                    len += y - _y;
                if(len < shortest){
                    shortest = len;
                    index = i;
                }
            }
            uint space = storages[index].getUnusedCapaInNextInterval();
            if(space >= valueLeft)
                storages[index].useCapaInNextInterval(valueLeft);
            else {
                storages[index].useCapaInNextInterval(space);
                valueLeft -= space;
            }
            j++;
        }
    }

    //New

    function newProsumer() public {
        prosumer[msg.sender] = new Prosumer(msg.sender);
        prosumerAddress.push(msg.sender);
    }

    function addNewStorage(uint _x, uint _y, uint _capacity) public {
        Storage newStorage = new Storage(msg.sender, _x, _y, _capacity);
        storages.push(newStorage);
        storageGrid[_x][_y] = newStorage;
        prosumer[msg.sender].addNewStorage(address(newStorage));
    }

    // Intervall

    function getActualInterval() public view returns(uint) {
        return now - (now % interval);
    }

    function getNextInterval() public view returns(uint) {
        return now - (now % interval) + interval;
    }

    //Getter
    function getStorageFromXY(uint _x, uint _y) public view returns(Storage) {
        return storageGrid[_x][_y];
    }

    function getUnusedCapaInNextInterval(uint _x, uint _y) public view returns(uint) {
        return storageGrid[_x][_y].getUnusedCapaInNextInterval();
    }



}

contract Prosumer {
    Home home;
    address owner;
    Storage[] storages;


    constructor(address _owner) public{
        home = Home(msg.sender);
        owner = _owner;
    }

    function addNewStorage(address _storage) public {
        require(msg.sender == address(home), "No permission");
        storages.push(Storage(_storage));
    }

}

contract Storage {
    Home home;
    uint x;
    uint y;
    Prosumer owner;
    uint maxCapa;
    uint capa;
    mapping(uint => uint) usedCapaInInterval;
    mapping(uint => bool) claimedInInterval;
    uint lastClaimed;

    struct Coordinates{
        uint x;
        uint y;
    }

    Coordinates coordinates;


    constructor(address _owner, uint _x, uint _y, uint _capa) public{
        owner = Prosumer(_owner);
        capa = _capa;
        home = Home(msg.sender);
        coordinates.x = _x;
        coordinates.y = _y;
        maxCapa = _capa;
        lastClaimed = now;
    }

    function setOffline() public {
        capa = 0;
    }

    function setOnline() public {
        capa = maxCapa;
    }

    function changeCapa(uint _capa) public{
        capa = _capa;
    }

    function changeXY(uint _x, uint _y) public{
        coordinates.x = _x;
        coordinates.y = _y;
    }

    function getXY() public view returns(uint, uint) {
        return (coordinates.x, coordinates.y);
    }

    function getCapa() public view returns(uint){
        return capa;
    }

    function useCapaInNextInterval(uint _value) public returns(uint _free){
        require(msg.sender == address(home), "No permission");
        require(usedCapaInInterval[home.getNextInterval()] + _value <= capa, "No capacity left");
        usedCapaInInterval[home.getNextInterval()] += _value;
        return usedCapaInInterval[home.getNextInterval()];
    }

    function getUnusedCapaInNextInterval() public view returns(uint _free) {
        return capa - usedCapaInInterval[home.getNextInterval()];
    }

    function claim() public returns(uint _value){
        lastClaimed = now;
    }

    function isClaimedInInterval(uint _interval) public view returns(bool){
        return claimedInInterval[_interval];
    }



}
