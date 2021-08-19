import { useState } from 'react';
import { ethers, utils } from 'ethers';
import abi from '../../contracts/nft-contract.abi.json';
import { NFT_CONTRACT_ADDRESS } from '../../constants/contract-address';
import { create } from '../../contracts/nft-contract';
import axios from 'axios';

const API_URL = 'http://localhost:3001/';

const CreateNFT = () => {

    // const [uri, setUri] = useState('');
    const [image, setImage] = useState('');
    const [externalUrl, setExternalUrl] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [attributes, setAttributes] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const [animationUrl, setAnimationUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [tokenAmount, setTokenAmount] = useState(1);

    
    const [token, setToken] = useState('0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c');
    const [amount, setAmount] = useState(100);
    const [multiply, setMultiply] = useState(10000);
    const [accrue, setAccrue] = useState(3000);
    const [intervalSeconds, setIntervalSeconds] = useState(25200);
    const [reduceCommission, setReduceCommission] = useState(1000);
    const [tokenCreated, setTokenCreated] = useState(false);

   /*
    const [token, setToken] = useState('');
    const [amount, setAmount] = useState(0);
    const [multiply, setMultiply] = useState(0);
    const [accrue, setAccrue] = useState(0);
    const [intervalSeconds, setIntervalSeconds] = useState(0);
    const [reduceCommission, setReduceCommission] = useState(0);
    const [tokenCreated, setTokenCreated] = useState(false);
*/

    const [author, setAuthor] = useState('');
    const [tokenId, setTokenId] = useState('');

  
    const createToken = async (event) => {
        event.preventDefault();
        console.log('contract address', NFT_CONTRACT_ADDRESS[4]);
        console.log('create Token');
        const url = await axios.post('/create-file', { 
            image, externalUrl, description, name, attributes, backgroundColor, animationUrl,
            youtubeUrl, tokenAmount
        }).then(res => res.data.url);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS[4], abi, signer);
        const res = await create(NFT_CONTRACT_ADDRESS[4], signer, url, 
            [
                token,
                amount,
                multiply,
                accrue,
                intervalSeconds,
                reduceCommission,
            ],
            tokenAmount
        );

        console.log({res});

        contract.on("TokenSeriesCreated", async (author, tokenId) => {
            setTokenCreated(true);
            setAuthor(author);
            const res = utils.formatUnits(tokenId, 0);
            setTokenId(res);
            console.log({ author, tokenId });
        });
    }


    return (
        <div style={{ textAlign: 'left'}}>
            <h3>Create NFT Token</h3>
            <form onSubmit={createToken}>
                <div>
                    <p>Image</p>
                    <input type="text" value={image} onChange={(evt) => setImage(evt.target.value)} />
                </div>
                <div>
                    <p>External Url</p>
                    <input type="text" value={externalUrl} onChange={(evt) => setExternalUrl(evt.target.value)} />
                </div>
                <div>
                    <p>Description</p>
                    <input type="text" value={description} onChange={(evt) => setDescription(evt.target.value)} />
                </div>
                <div>
                    <p>Name</p>
                    <input type="text" value={name} onChange={(evt) => setName(evt.target.value)} />
                </div>
                <div>
                    <p>Background Color</p>
                    <input type="text" value={backgroundColor} onChange={(evt) => setBackgroundColor(evt.target.value)} />
                </div>
                <div>
                    <p>Animation Url</p>
                    <input type="text" value={animationUrl} onChange={(evt) => setAnimationUrl(evt.target.value)} />
                </div>
                <div>
                    <p>Youtube Url</p>
                    <input type="text" value={youtubeUrl} onChange={(evt) => setYoutubeUrl(evt.target.value)} />
                </div>
                <div>
                    <p>Attributes</p>
                    <input type="text" value={attributes} onChange={(evt) => setAttributes(evt.target.value)} />
                </div>
                <div>
                    <p>Token Amount</p>
                    <input type="text" value={tokenAmount} onChange={(evt) => setTokenAmount(evt.target.value)} />
                </div>
                <h4>Commission Params:</h4>
                <div style={{ paddingLeft: '20px', borderLeft: 'solid 1px lightgray'}}>
                    <div>
                        <p>Token</p>
                        <input type="text" value={token} onChange={(evt) => setToken(evt.target.value)} />
                    </div>
                    <div>
                        <p>Amount</p>
                        <input type="text" value={amount} onChange={(evt) => setAmount(evt.target.value)} />
                    </div>
                    <div>
                        <p>Multiply</p>
                        <input type="text" value={multiply} onChange={(evt) => setMultiply(evt.target.value)} />
                    </div>
                    <div>
                        <p>Accrue</p>
                        <input type="text" value={accrue} onChange={(evt) => setAccrue(evt.target.value)} />
                    </div>
                    <div>
                        <p>IntervalSeconds</p>
                        <input type="text" value={intervalSeconds} onChange={(evt) => setIntervalSeconds(evt.target.value)} />
                    </div>
                    <div>
                        <p>ReduceCommission</p>
                        <input type="text" value={reduceCommission} onChange={(evt) => setReduceCommission(evt.target.value)} />
                    </div>
                </div>

                <div style={{ paddingTop: '16px' }}>
                    <input type="submit" value="Create Token" />
                </div>
                
            </form>
            { tokenCreated && 
                <p>
                    {author} created new token with tokenId: {tokenId}
                </p>
            }
        </div>
    );
}

export default CreateNFT;
