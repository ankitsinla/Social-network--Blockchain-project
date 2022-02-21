pragma solidity >=0.4.22 <0.9.0;

contract NewContract{
    string public name;
    uint public postCount = 0;
    mapping(uint => Post) public posts;

    struct Post{
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event postCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    event postTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );

    constructor() public {
        name = "ankit";
    }

    function createPost(string memory _content) public {
        require(bytes(_content).length > 0);

        postCount++;
        
        
        posts[postCount] = Post(postCount,_content,0,msg.sender);

        emit postCreated(postCount, _content, 0, msg.sender);
    }

    function tipPost(uint _id) public payable {
        require(_id > 0 && _id <= postCount);

        //fetch post
        Post memory _post = posts[_id];
        //fetch author
        address payable _author = _post.author;
        //pay author
        address(_author).transfer(msg.value);
        //increment tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        //update post
        posts[_id] = _post;
        //trigger event
        emit postTipped(_post.id, _post.content, _post.tipAmount, _post.author);
    }
}