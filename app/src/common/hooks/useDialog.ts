import { useAppDispatch } from 'app/store';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import { closeDialog, openDialog } from 'components/Dialogs/globalDialogSlice';
import { ComponentType } from 'react';

const useDialog = () => {
  const dispatch = useAppDispatch();

  const show = (DialogComponent: ComponentType<any>, props: any) => {
    return new Promise<any>((resolve) => {
      const id = new Date().getTime();
      const newProps = { ...(props || {}) };

      newProps.onDialogClose = (modalResult: object) => {
        dispatch(closeDialog(id));
        resolve(modalResult);
      };
      dispatch(
        openDialog({
          id,
          component: DialogComponent,
          props: newProps
        })
      );
    });
  };

  const message = async (props: any) => {
    const dialog = await show(ConfirmDialog, props);
    return dialog;
  };

  return {
    show,
    message
  };
};

export default useDialog;

/*
    const dialog = useDialog();
    #1: 
    dialog.message({
      title: "Dialog Title",
      message: "Dialog Message",
    }); 
    Notes : this object will be passed into component ConfirmDialog as props;
    #2: 
    const result: any = await dialog.show(CustomDialog, {
      title: 'Create a category',
      item: { name: 'Category Name', property1: 'Property 1 value' },
    });
    Notes: CustomDialog will have prop : onDialogClose
*/
