// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Transfer.sol";

contract MultiSend is Transfers {
    event MultiSended(uint256 total, address tokenAddress);

    function sendToken(
        address _tokenAddress,
        address creator,
        address[] memory _recepients,
        uint256[] memory _amounts
    ) public {
        require(_recepients.length > 0, "_recepients length is greater than 0");
        // require(_recepients.length <= 200, '_recepients length is smaller than 200');
        require(_recepients.length == _amounts.length);

        uint8 i = 0;
        for (i; i < _recepients.length; i++)
            transferTokens(
                creator,
                payable(_recepients[i]),
                _tokenAddress,
                _amounts[i]
            );

        emit MultiSended(_recepients.length, _tokenAddress);
    }
}
