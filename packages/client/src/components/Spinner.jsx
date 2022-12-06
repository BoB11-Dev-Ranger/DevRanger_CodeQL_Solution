import { Oval } from "react-loader-spinner";
export default function Spinner(props) {
  return (
    <>
      <div style={{display:"flex",justifyContent:"center"}}>
        <Oval
          ariaLabel="loading-indicator"
          height={30}
          width={30}
          strokeWidth={3}
          color="#073245"
          secondaryColor="grey"
        />
      </div>
    </>
  );
}