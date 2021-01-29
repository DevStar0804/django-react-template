import React, { useState } from "react";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { Tr, Td } from "react-super-responsive-table";
import Alert from '@material-ui/lab/Alert';

const ExtractionTable = (props) => {
    const [open, setOpen] = useState(false);
    const [isEditAlert, setIsEditAlert] = useState(false);
    const [type, setType] = useState(props.extraction.attribute || '');
    const [value, setValue] = useState(props.extraction.value || '');
    const [words, setWords] = useState(props.extraction.words_matched || '');
    const [enabled, setEnabled] = useState(props.extraction.enabled || '');

    const editAttribute = () =>{
        if (type.trim() == '' || value == '' || words.trim() == '' || enabled.trim() == '')
            setIsEditAlert(true);
        else{
            props.editAttribute(props.index, words, value, type, enabled);
            setOpen(false);
        }
    }

    return (
        <Tr>
            <Td>{props.extraction.attribute+'('+props.extraction.api_attribute+')'}</Td>
            <Td>{props.extraction.value+'('+props.extraction.api_value+')'}</Td>
            <Td>{props.extraction.words_matched}</Td>
            <Td>
                <a className="button is-primary" onClick={()=>setOpen(true)}>Edit</a>
                <a className="button is-text" onClick={()=>props.changeStatus(props.index)}>{props.extraction.enabled}</a>
                <Dialog
                    open={open}
                    onClose={()=>setOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Edit Attribute</DialogTitle>
                    <DialogContent>
                        {isEditAlert && <Alert severity="error" onClose={()=>setIsEditAlert(false)}>Please input exactly!!!</Alert>}
                        <div className="semisection">
                            <TextField  size="small" placeholder="Type" value={type} variant="outlined" onChange={(e)=>setType(e.target.value)} />
                        </div>
                        <div className="semisection">
                            <TextField  size="small" placeholder="Value" value={value} variant="outlined" onChange={(e)=>setValue(e.target.value)} />
                        </div>
                        <div className="semisection">
                            <TextField  size="small" placeholder="Words matched on" value={words} variant="outlined" onChange={(e)=>setWords(e.target.value)} />
                        </div>
                        <div className="semisection">
                            <TextField
                                id="outlined-select-currency-native"
                                select
                                fullWidth
                                size="small"
                                value={enabled}
                                onChange={(e)=>setEnabled(e.target.value)}
                                SelectProps={{
                                    native: true,
                                }}
                                variant="outlined"
                            >
                                <option value="Enable">Enable</option>
                                <option value="Disable">Disable</option>
                            </TextField>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={()=>editAttribute()} className="button is-success" autoFocus>
                            Confirm
                        </button>
                        <button onClick={()=>setOpen(false)} className="button is-danger" >
                            Cancel
                        </button>
                    </DialogActions>
                </Dialog>
            </Td>
        </Tr>
    )

}

export default ExtractionTable;