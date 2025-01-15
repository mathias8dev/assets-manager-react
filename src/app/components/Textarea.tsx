import React from "react";
import {Input} from "rsuite";
import {InputProps} from "rsuite/esm/Input/Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, InputProps>((props, ref) => {
    return <Input {...props}
                  as="textarea"
                  ref={ref}/>
});
Textarea.displayName = "textarea";

export default Textarea;