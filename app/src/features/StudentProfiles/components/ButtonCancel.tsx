interface IProps {
  backgroundColor?: string;
}

const ButtonCancel = ({ backgroundColor = '#FCA741' }: IProps) => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="14" fill={backgroundColor} stroke="white" strokeWidth="2" />
      <path
        d="M21.733 9.62518L20.3773 8.26941L15.0023 13.6444L9.62725 8.26941L8.27148 9.62518L13.6465 15.0002L8.27148 20.3752L9.62725 21.7309L15.0023 16.3559L20.3773 21.7309L21.733 20.3752L16.358 15.0002L21.733 9.62518Z"
        fill="white"
      />
    </svg>
  );
};

export default ButtonCancel;
