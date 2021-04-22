import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { connect } from 'react-redux';
import { addCheque, addItems, openDialog } from './store/actions/actions';

class TextFieldComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            empty : false,
            helperText : '',
            canBeSend : false
        }
    }

    componentDidMount(){
        this.setState({helperText : this.props.helperTextParam});
    }

    onChange(e){
        if (e.target.value.length > 0){
            this.setState({empty : false, helperText : ''});
        }
        if (this.props.type === 'number' && Number(e.target.value) < 0){
            this.setState({empty : true, helperText : 'Число не может быть отрицательным'});
        }
    }

    onBlurField(e){
        const { helperTextParam } = this.props;

        if (e.target.value.length === 0){
            this.setState({empty : true, helperText : helperTextParam, canBeSend : false});
        } else if (this.props.type === 'number' && Number(e.target.value) < 0) {
            this.setState({empty : true, helperText : 'Число не может быть отрицательным', canBeSend : false});
        } else {
            this.setState({empty : false, helperText : '', canBeSend : true});
        }
    }

    render(){

        const {id, label, type, ref, defaultValue, name, onChangeHandler, error, errorType} = this.props;
        const { empty, helperText } = this.state;

        return(
            <TextField
                id={id} 
                label={label} 
                inputRef={ref}
                name={name}
                type={type}
                errorType={errorType}
                onChange={(e) => this.onChange(e)}
                onKeyUp={(e) => onChangeHandler(e, errorType)}
                error={empty || error} 
                defaultValue={defaultValue}
                helperText={(empty || error) && helperText}
                onBlur={(e) => this.onBlurField(e)} 
                autoComplete='off'
                inputProps={{min : '1', max : '3'}}
                className='formField'
                fullWidth />
        )
    }
}

class AddChequeDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            kioskValue : '',
            paysValue : '',
            sumValue : '',
            quantityValue : '',
            nameValue : '', 
            dateValue : '2020-02-20T12:06:19.45', 

            kioskError : false,
            paysError : false,
            sumError : false,
            quantityError : false,
            nameError : false,
            dateError : false,
        }
        this.kioskRef = React.createRef();
    }

    checkForm(e, errorType){
        if (e.target.value.length === 0){
            this.setState({[errorType] : true});
            return;
        }

        const target = e.target;
        const name = e.target.name;

        this.setState({[name] : target.value, [errorType] : false});
    }

    addCheque = e => {

        const { kioskValue, paysValue, sumValue, quantityValue, nameValue, dateValue } = this.state;
        
        if (kioskValue.length === 0){
            this.setState({kioskError : true});
        }
        if (dateValue.length === 0){
            this.setState({dateError : true});
        }
        if (paysValue.length === 0 || paysValue < 0){
            this.setState({paysError : true});
        }
        if (sumValue.length === 0 || sumValue < 0){
            this.setState({sumError : true});
        }
        if (quantityValue.length === 0 || quantityValue < 0){
            this.setState({quantityError : true});
        }
        if (nameValue.length === 0 || nameValue < 0){
            this.setState({nameError : true});
        }
        else {
            this.props.openDialog(false);
            this.props.addCheque({
                kioskName : kioskValue, 
                chequeType : 0,
                dateReg : dateValue,
                uid : kioskValue + dateValue + sumValue + quantityValue,
                payType : 0,
                sum : Number(sumValue),
                pays : [{
                    sum : Number(paysValue),
                    payType : 0, 
                    datePay : dateValue
                }], 
                positions : [{
                    quantity : Number(quantityValue),
                    sum : Number(sumValue),
                    price : Number(sumValue),
                    name : nameValue
                }]
            })
            this.setState({
                kioskValue : '',
                paysValue : '',
                sumValue : '',
                quantityValue : '',
                nameValue : '',

                kioskError : false,
                paysError : false,
                sumError : false,
                quantityError : false,
                nameError : false,
                dateError : false,
            })
        }
    }

    close = () => {
        this.props.openDialog(false);
    }

    render(){

        const { kioskError, paysError, sumError, nameError, quantityError, open } = this.state;

        return(
            <React.Fragment>
                <Dialog open={this.props.dialogOpen}>
                    <DialogTitle style={{display : 'flex', alignItems : 'center'}}>Добавить чек</DialogTitle>
                    <DialogContent>
                        <TextField onChange={(e) => this.checkForm(e)} fullWidth errorType="dateError" name="dateValue" label="Дата покупки" type="datetime-local" defaultValue="2020-02-20T12:06:19.45" />
                        <TextFieldComponent 
                            error={kioskError} 
                            mainAction={this.addCheque} 
                            onChangeHandler={(e, errorType) => this.checkForm(e, errorType)} 
                            errorType="kioskError" 
                            name="kioskValue" 
                            ref={this.kioskRef} 
                            label='Киоск' 
                            id='kiosk' 
                            type='text' 
                            helperTextParam='Введите название киоска' />
                        <TextFieldComponent 
                            error={paysError} 
                            onChangeHandler={(e, errorType) => this.checkForm(e, errorType)} 
                            errorType="paysError" 
                            name="paysValue" 
                            label='Оплата' 
                            id='checkout' 
                            type='number' 
                            helperTextParam='Введите сумму оплаты' />
                        <TextFieldComponent 
                            error={sumError} 
                            onChangeHandler={(e, errorType) => this.checkForm(e, errorType)} 
                            errorType="sumError" 
                            name="sumValue" 
                            label='Сумма' 
                            id='sum' 
                            type='number' 
                            helperTextParam='Введите сумму' />
                        <TextFieldComponent 
                            error={quantityError} 
                            onChangeHandler={(e, errorType) => this.checkForm(e, errorType)} 
                            errorType="quantityError" 
                            name="quantityValue" 
                            label='Количество товара' 
                            id='quantity' 
                            type='number' 
                            helperTextParam='Введите количество товара' />
                        <TextFieldComponent 
                            error={nameError} 
                            onChangeHandler={(e, errorType) => this.checkForm(e, errorType)} 
                            errorType="nameError" 
                            name="nameValue" 
                            label='Название товара' 
                            id='name' 
                            type='text' 
                            helperTextParam='Введите название товара' />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.close()} color="primary">Отмена</Button>
                        <Button onClick={this.addCheque} color="primary">Добавить</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return state;
}
const mapDispatchToProps = dispatch => {
    return {
        addCheque : function(cheque){
            dispatch(addCheque(cheque));
        },
        addItems : function(items){
            dispatch(addItems(items));
        },
        openDialog : function(open){
            dispatch(openDialog(open))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddChequeDialog);