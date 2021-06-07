import { IRenderItem } from '../render';

function useRenderItem(props: any) {
  //输入框
  function renderInput(item: IRenderItem, type?: string) {
    let key = item.prop;
    return (
      <el-input
        model-value={props.form[key]}
        {...{
          'onUpdate:modelValue': (e: string | number) => {
            props.form[key] = typeof e === 'string' ? e.trim() : e;
          }
        }}
        onClear={() => {
          this.onSubmit();
        }}
        ref={item.ref}
        placeholder={type === 'editor' ? '请输入' + item.label : item.label}
        type={item.textarea ? 'textarea' : ''}
        disabled={item.disabled}
        showPassword={item.showPassword}
        autosize
        maxlength={item.maxlength ? item.maxlength : ''}
        show-word-limit
        clearable
      />
    );
  }
  const renderMap: any = {
    input: renderInput
  };
  return {
    renderMap
  };
}

export default useRenderItem;
