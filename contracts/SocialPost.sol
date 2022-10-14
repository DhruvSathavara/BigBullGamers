// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract BigBullGamersPosts {
    event CreatePost(
        bytes32 indexed postId,
        address indexed postOwner,
        bytes32 contentId,
        uint256 indexed tokenId
    );
    event CreateContest(
        bytes32 indexed contestId,
        address indexed contestOwner,
        bytes32 contestDataId,
        uint256 indexed tokenId
    );
    event AddContent(bytes32 indexed contentId, string contentUri);

    struct post {
        address postOwner;
        bytes32 contentId;
        uint256 tokenId;
    }

    struct contest {
        address contestOwner;
        bytes32 contestDataId;
        uint256 tokenId;
    }

    mapping(bytes32 => string) contentRegistry;
    mapping(bytes32 => post) postRegistry;
    mapping(bytes32 => contest) contestRegistry;

    function createPost(string calldata _contentUri, uint256 tokenId) external {
        address _owner = msg.sender;
        uint256 _tokenId = tokenId;
        bytes32 _contentId = keccak256(abi.encode(_contentUri));
        bytes32 _postId = keccak256(abi.encodePacked(_owner, _contentId));
        contentRegistry[_contentId] = _contentUri;
        postRegistry[_postId].postOwner = _owner;
        postRegistry[_postId].contentId = _contentId;
        postRegistry[_postId].tokenId = _tokenId;
        emit AddContent(_contentId, _contentUri);
        emit CreatePost(_postId, _owner, _contentId, _tokenId);
    }

    function createContest(string calldata _contestUri, uint256 tokenId)
        external
    {
        address _owner = msg.sender;
        uint256 _tokenId = tokenId;
        bytes32 _contentId = keccak256(abi.encode(_contestUri));
        bytes32 _contestId = keccak256(abi.encodePacked(_owner, _contentId));
        contentRegistry[_contentId] = _contestUri;
        contestRegistry[_contestId].contestOwner = _owner;
        contestRegistry[_contestId].contestDataId = _contentId;
        contestRegistry[_contestId].tokenId = _tokenId;
        emit AddContent(_contentId, _contestUri);
        emit CreateContest(_contestId, _owner, _contentId, _tokenId);
    }

    function getContest(bytes32 _contestId)
        public
        view
        returns (
            address,
            bytes32,
            uint256
        )
    {
        return (
            postRegistry[_contestId].postOwner,
            postRegistry[_contestId].contentId,
            postRegistry[_contestId].tokenId
        );
    }

    function getContent(bytes32 _contentId)
        public
        view
        returns (string memory)
    {
        return contentRegistry[_contentId];
    }

    function getPost(bytes32 _postId)
        public
        view
        returns (
            address,
            bytes32,
            uint256
        )
    {
        return (
            postRegistry[_postId].postOwner,
            postRegistry[_postId].contentId,
            postRegistry[_postId].tokenId
        );
    }
}
