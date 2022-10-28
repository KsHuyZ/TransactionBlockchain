import "../styles/globals.css";
import "../styles/modal.css";
import {
  TransactionContext,
  TransactionProvider,
} from "../context/TransactionContext";
import ModalLoading from "../components/ModalLoading";
import { useContext } from "react";

function MyApp({ Component, pageProps }) {

  
  return (
    <TransactionProvider>
      
      <Component {...pageProps} />
    </TransactionProvider>
  );
}

export default MyApp;
