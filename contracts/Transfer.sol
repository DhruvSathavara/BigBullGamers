// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';

contract Transfers is Ownable, ERC721Holder {
    /*
     * @dev : standard method to send tokens from an account to another ( + payment fee )
     */
    function transferTokens(
        address from,
        address payable to,
        address token,
        uint256 amount
    ) public {
        if (token != address(0)) {
            IERC721(token).transferFrom(from, to, amount);
        } else {
            require(to.send(amount), 'Transfer of ETH to receiver failed');
        }
    }
}