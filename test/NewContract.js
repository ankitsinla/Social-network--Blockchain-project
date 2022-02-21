const { assert } = require('chai');

const NewContract = artifacts.require("./NewContract.sol");

require('chai').use(require('chai-as-promised')).should()

contract('NewContract',async ([deployer,author,tipper])=>{
    let newContract;

    before(async () =>{
        newContract = await NewContract.deployed();
    })
    describe('deployment',async ()=>{
        it('deploy successfully', async ()=>{
            const address = newContract.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, )
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has name', async ()=>{
            const name = await newContract.name();
            assert.equal(name,'ankit')
        })
    })

    describe('posts',async () =>{
        let result, postCount

        before(async () =>{
            result = await newContract.createPost('My first Post', { from :author})
            postCount = await newContract.postCount()
        })
            
        it('creates posts', async() =>{
            //success
            assert.equal(postCount,1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(event.content , 'My first Post', 'content is correct')
            assert.equal(event.tipAmount, 0,'Tip amount is correct')
            assert.equal(event.author, author , 'author is correct')
            
            //failure
            await newContract.createPost('', {from: author}).should.be.rejected;
        })


        it('lists posts',async () =>{
            const posts = await  newContract.posts(postCount)
            assert.equal(posts.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(posts.content , 'My first Post', 'content is correct')
            assert.equal(posts.tipAmount, 0,'Tip amount is correct')
            assert.equal(posts.author, author , 'author is correct')
        })

        it('allows users to tip posts', async () =>{
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

            result = await newContract.tipPost(postCount,{from : tipper, value :web3.utils.toWei('1' , 'Ether')})

            const event = result.logs[0].args
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct')
            assert.equal(event.content , 'My first Post', 'content is correct')
            assert.equal(event.tipAmount, '1000000000000000000','Tip amount is correct')
            assert.equal(event.author, author , 'author is correct')

            let newAuthorBalance 
            newAuthorBalance =  await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)

            let tipAmount 
            tipAmount = web3.utils.toWei('1','Ether')
            tipAmount = new web3.utils.BN(tipAmount)

            const expectedBalance = oldAuthorBalance.add(tipAmount)

            assert.equal(newAuthorBalance.toString(), expectedBalance.toString() )

            //failure
            await await newContract.tipPost(99,{from : tipper, value :web3.utils.toWei('1' , 'Ether')}).should.be.rejected


        })
    })
})
