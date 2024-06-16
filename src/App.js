import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constantes
const TWITTER_HANDLE = "web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

// URLs de teste para GIFs
const TEST_GIFS = [
  "https://i.giphy.com/media/xUOxffMyVjqAnuJpJu/giphy.webp",
  "https://media3.giphy.com/media/26n7aJwq73ubRevoQ/giphy.gif?cid=ecf05e47gpuxzul6z0774k47hcjp5p74uwfbfaq4xfjjco0c&rid=giphy.gif&ct=g",
  "https://media3.giphy.com/media/3o7aD5euYKz5Ly7Wq4/giphy.gif?cid=ecf05e47gx235xsfy7tqmzvhwz06ztzaxr63av1f446mlluz&rid=giphy.gif&ct=g",
  "https://media2.giphy.com/media/XKwfxBDG32ayrLHfAY/giphy.gif?cid=ecf05e47he0xf0mwnfx51x1f6m0wi4hzi52ql2dh0lnfe0tk&rid=giphy.gif&ct=g",
];

const App = () => {
  // State para armazenar o endereço da carteira, valor do input e lista de GIFs
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  // Função para verificar se a carteira Phantom está conectada
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet encontrada!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Conectado com a Chave Pública:",
            response.publicKey.toString()
          );

          // Define a chave pública do usuário no estado para ser usada posteriormente
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Objeto Solana não encontrado! Instale a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Função para conectar a carteira manualmente
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log(
        "Conectado com a Chave Pública:",
        response.publicKey.toString()
      );
      setWalletAddress(response.publicKey.toString());
    }
  };

  // Atualiza o estado com o valor do input
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  // Adiciona o link do GIF à lista
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("Gif link:", inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("Input vazio. Tente novamente.");
    }
  };

  // Renderiza o botão de conectar carteira se a carteira não estiver conectada
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Conecte sua carteira
    </button>
  );

  // UseEffect para verificar se a carteira está conectada quando o componente monta
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // UseEffect para carregar a lista de GIFs quando a carteira está conectada
  useEffect(() => {
    if (walletAddress) {
      console.log("Obtendo lista de GIFs...");

      // Chama o programa da Solana aqui.

      // Define o estado com os GIFs de teste
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  // Renderiza a interface quando a carteira está conectada
  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Entre com o link do gif!!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Enviar
        </button>
      </form>
      <div className="gif-grid">
        {/* Map através da 'gifList' para exibir os GIFs */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="App">
      {/* Muda a classe com base no estado da carteira */}
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">Meu Portal de GIF 🧧</p>
          <p className="sub-text">Veja sua coleção de GIF no metaverso ✨</p>
          {/* Renderiza o botão de conectar carteira se não houver um endereço de carteira */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* Renderiza a interface conectada se houver um endereço de carteira */}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`feito com ❤️ por @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
