import { useAppSelector } from 'app/store';

const GlobalDialog = () => {
  const { dialogs } = useAppSelector((state) => state.dialogs);

  return (
    <>
      {dialogs &&
        dialogs.map((x) => {
          const { component: DialogComponent, id, props } = x;

          return <DialogComponent key={id} {...props} />;
        })}
    </>
  );
};

export default GlobalDialog;
