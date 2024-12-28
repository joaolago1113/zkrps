import { useEffect, useState } from 'react';
import { EasyPrivateVotingContract } from '../artifacts/EasyPrivateVoting';
import { AccountWallet, CompleteAddress, ContractDeployer, PXE, createPXEClient, waitForPXE, AztecAddress } from '@aztec/aztec.js';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';
import { Fr } from '@aztec/circuits.js';
import { Button, Select, Spin, notification } from 'antd';
import { RockIcon, PaperIcon, ScissorsIcon } from '../components/Icons';
import styles from '../styles/RockPaperScissors.module.css';

type Move = 'Rock' | 'Paper' | 'Scissors';

const RockPaperScissors = () => {
    const [pxe, setPxe] = useState<PXE | null>(null);
    const [wallet, setWallet] = useState<AccountWallet | null>(null);
    const [contract, setContract] = useState<EasyPrivateVotingContract | null>(null);
    const [selectedMove, setSelectedMove] = useState<Move | null>(null);
    const [gameStatus, setGameStatus] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const initialize = async () => {
            const { PXE_URL = 'http://localhost:8080' } = process.env;
            const pxeClient = await createPXEClient(PXE_URL);
            await waitForPXE(pxeClient);
            setPxe(pxeClient);

            // Initialize wallet and contract
            const [walletInstance] = await getInitialTestAccountsWallets(pxeClient);
            setWallet(walletInstance);

            const deployedContract = await EasyPrivateVotingContract.at(
                AztecAddress.fromString('0xYourContractAddress'),
                walletInstance
            );
            setContract(deployedContract);
        };

        initialize();
    }, []);

    const handleMoveSelection = (move: Move) => {
        setSelectedMove(move);
    };

    const playMove = async () => {
        if (!contract || !selectedMove) {
            notification.error({ message: 'Please select a move.' });
            return;
        }

        setLoading(true);
        setGameStatus('Submitting your move...');

        try {
            // Convert move to Field (assuming Rock=0, Paper=1, Scissors=2)
            const moveValue = selectedMove === 'Rock' ? 0 : selectedMove === 'Paper' ? 1 : 2;
            const fieldMove = new Fr(moveValue);

            const tx = await contract.methods.cast_vote(fieldMove).send().wait();
            setGameStatus('Move submitted! Waiting for opponent...');
            
            // Fetch and display game result
            // Replace with actual game result fetching logic
            // For example:
            // const result = await contract.methods.get_game_result().simulate();
            // setGameStatus(`Game Result: ${result}`);
        } catch (error: any) {
            console.error(error);
            setGameStatus('An error occurred while submitting your move.');
            notification.error({ message: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Rock Paper Scissors</h1>
            {!wallet ? (
                <Button type="primary" onClick={() => {/* Implement wallet connection */}}>
                    Connect Wallet
                </Button>
            ) : (
                <>
                    <div className={styles.moves}>
                        <Button icon={<RockIcon />} onClick={() => handleMoveSelection('Rock')}>
                            Rock
                        </Button>
                        <Button icon={<PaperIcon />} onClick={() => handleMoveSelection('Paper')}>
                            Paper
                        </Button>
                        <Button icon={<ScissorsIcon />} onClick={() => handleMoveSelection('Scissors')}>
                            Scissors
                        </Button>
                    </div>
                    <Button type="primary" onClick={playMove} disabled={!selectedMove || loading}>
                        {loading ? <Spin /> : 'Play'}
                    </Button>
                    {gameStatus && <p className={styles.status}>{gameStatus}</p>}
                </>
            )}
        </div>
    );
};

export default RockPaperScissors; 