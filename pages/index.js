import { useContext } from "react";
import Header from "../components/Header";
import Main from "../components/Main";
import ModalLoading from "../components/ModalLoading";
import TransactionHistory from "../components/TransactionHistory";
import { TransactionContext } from "../context/TransactionContext";

const style = {
  wrapper: `h-min-screen bg-[#2D242F] text-white select-none flex flex-col justify-between`,
};

export default function Home() {
  const { isLoading } = useContext(TransactionContext);
  return (
    <div>
      {isLoading && <ModalLoading />}
      <div className={style.wrapper}>
        <Header />
        <Main />
        <TransactionHistory />
      </div>
    </div>
  );
}
