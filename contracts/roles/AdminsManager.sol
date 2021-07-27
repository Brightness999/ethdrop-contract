// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ContributorManager.sol";

contract AdminsManager is ContributorManager {

    // event AdminAdded(address indexed account, uint256 groupId);
    // event AdminRemoved(address indexed account, uint256 groupId);

    event GroupCreated(string groupName, uint256 groupId);
    event EventStarted(address indexed startedBy, uint256 groupId);
    event RegistrationEnded(address indexed endedBy, uint256 groupId);
    event EventEnded(address indexed endedBy, uint256 groupId);
    event AdminAdded(uint groupId);
    event AdminRemoved(uint groupId);

    event CalculatedPot(
        uint256 registeredRecipientCount,
        uint256 winningsPerRecipient
    );

    constructor() {}

    modifier onlyAdmins(uint256 groupId) {
        require(isAdmin(msg.sender, groupId));
        _;
    }

    function isAdmin(address account, uint256 groupId)
        public
        view
        returns (bool)
    {
        return admins[groupId][account] == true;
    }

    function amIAdmin(uint groupId) external view returns (bool) {
        return admins[groupId][msg.sender] == true;
    }

    function getAdminsForGroup(uint256 groupId) external view returns (address[] memory, bool[] memory) {
        return (adminAddresses[groupId], adminEnabled[groupId]);
    }

    modifier onlyAdminsOrCOO(uint256 groupId) {
        require(isAdmin(msg.sender, groupId) || msg.sender == cooAddress);
        _;
    }

    // TODO - allow COO to give "admin-granting power" to other admins
    function addAdmin(address account, uint256 groupId) external onlyCOO {
        _addAdmin(account, groupId);

        emit AdminAdded(groupId);
    }

    function removeAdmin(address account, uint256 groupId) external onlyCOO {
        _removeAdmin(account, groupId);
    }

    function renounceAdmin(uint256 groupId) public onlyAdmins(groupId) {
        _removeAdmin(msg.sender, groupId);
    }

    function _addAdmin(address account, uint256 groupId) internal {
        admins[groupId][account] = true;

        adminAddressToIndex[groupId][account] = adminAddressToIndexNextIndex;
        adminAddressToIndexNextIndex++;

        adminAddresses[groupId].push(account);
        adminEnabled[groupId].push(true);
        // TODO - adminNames

        emit AdminAdded(groupId);
    }

    function _removeAdmin(address account, uint256 groupId) internal {
        admins[groupId][account] = false;

        uint index = adminAddressToIndex[groupId][account];
        adminEnabled[groupId][index] = false;

        emit AdminRemoved(groupId);
    }

    function readEventInfo(uint256 groupId)
        external
        view
        onlyAdmins(groupId)
        returns (EthDropEvent memory)
    {
        return currentEvents[groupId];
    }

    function createNewGroup(string memory groupName) external onlyCOO whenNotPaused {
        // uint256 newGroupId = uint256(blockhash(block.number));
        uint256 newGroupId = block.timestamp;

        EthDropEvent memory newGroup = EthDropEvent(
            newGroupId,
            groupName,
            EventState.CREATED,
            block.timestamp,
            block.timestamp,
            block.timestamp,
            0,
            "",
            "",
            "",
            address(0),
            0,
            0,
            0
        );

        currentEvents[newGroupId] = newGroup;

        listOfGroupIds.push(newGroupId);
        listOfGroupNames.push(groupName);

        emit GroupCreated(groupName, newGroupId);
    }

    function startEvent(uint256 groupId)
        external
        onlyAdmins(groupId)
        whenNotPaused
    {
        currentEvents[groupId].currentState = EventState.REGISTRATION;
        currentEvents[groupId].startTime = block.timestamp;

        emit EventStarted(msg.sender, groupId);
    }

    function closeEventRegistration(uint256 groupId)
        external
        onlyAdmins(groupId)
        whenNotPaused
    {
        currentEvents[groupId].registrationEndTime = block.timestamp;


        uint devCutWei = currentEvents[groupId].totalAmountContributed * devCutPercentage / 100;

        // Transfer dev cut to cfo
        payable(cfoAddress).transfer(devCutWei);

        // pot is the amount for recipients to share
        uint pot = currentEvents[groupId].totalAmountContributed - devCutWei;

        // each recipient's winnings is the "weiWinnings"
        currentEvents[groupId].weiWinnings = pot / currentEvents[groupId].registeredRecipientsCount;

        // uint256[] memory potShares = new uint256[](
        //     currentEvents[groupId].registeredRecipientsCount
        // );

        // for (
        //     uint256 i;
        //     i < currentEvents[groupId].registeredRecipientsCount;
        //     i++
        // ) {
        //     potShares[i] = 1;
        // }

        // pot[groupId] = new PaymentSplitter(
        //     registeredRecipientAddressesArray[groupId],
        //     potShares
        // );

        currentEvents[groupId].currentState = EventState.CLAIM_WINNINGS;

        // uint256 winningsPerRecipient = address(this).balance /
        //     pot[groupId].totalShares();

        // emit CalculatedPot(
        //     currentEvents[groupId].registeredRecipientsCount,
        //     winningsPerRecipient
        // );

        emit RegistrationEnded(msg.sender, groupId);
    }

    function endEvent(uint256 groupId)
        external
        onlyAdminsOrCOO(groupId)
        whenNotPaused
    {
        currentEvents[groupId].endTime = block.timestamp;

        currentEvents[groupId].currentState = EventState.ENDED;

        pastEvents[groupId].push(currentEvents[groupId]);

        emit EventEnded(msg.sender, groupId);
    }

    function addEligibleRecipient(address account, string memory name, uint256 groupId)
        external
        whenNotPaused
        onlyAdmins(groupId)
    {
        eligibleRecipients[groupId][account] = true;

        eligibleRecipientAddressesArray[groupId].push(account);
        eligibleRecipientNamesArray[groupId].push(name);

        recipientAddressToName[groupId][account] = name;
        eligibleRecipientsEligibilityIsEnabled[groupId].push(true);

        emit EligibleRecipientAdded(account, groupId);
    }

    function removeEligibleRecipient(address account, uint256 groupId)
        external
        onlyAdmins(groupId)
        whenNotPaused
    {
        eligibleRecipients[groupId][account] = false;
        emit EligibleRecipientRemoved(account, groupId);
    }

    function changeContributor(address account, uint256 groupId)
        external
        onlyAdminsOrCOO(groupId)
        whenNotPaused
    {
        _changeContributor(account, groupId);
    }

    function removeContributor(address account, uint256 groupId)
        external
        onlyAdminsOrCOO(groupId)
        whenNotPaused
    {
        _removeContributor(account, groupId);
    }
}