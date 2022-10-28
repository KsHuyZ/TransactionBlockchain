import React, { useContext } from "react";
import { css } from "@emotion/react";
import { MoonLoader } from "react-spinners";
import { TransactionContext } from "../context/TransactionContext";

const cssOverride = css`
  display: block;
  margin: 0 auto;
  border-color: white;
`;

const style = {
  wrapper: `text-black h-4/6 w-5/12 flex flex-col justify-center items-center bg-white rounded-xl`,
  title: `font-semibold text-xl mb-12`,
};

const TransactionLoader = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.title}>Transaction in progress...</div>
      <MoonLoader color={"black"} loading={true} css={cssOverride} size={50} />
    </div>
  );
};

const ModalLoading = () => {
  const { setIsLoading } = useContext(TransactionContext);
  return (
    <div class="modal-overlay">
      <TransactionLoader />
    </div>
  );
};

export default ModalLoading;
