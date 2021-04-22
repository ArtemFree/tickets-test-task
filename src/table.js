import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import AddChequeDialog from './dialog';
import { connect } from 'react-redux';
import { addCheque, addItems, openDialog, selectItems, deleteItems } from './store/actions/actions';

class Data extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cheques : [],
            // selected : []
        }
    }

    componentDidMount(){
        fetch('data.json').then(data => data.json()).then(data => {
            this.props.addItems(data.data.cheques);
        });
    }

    getStatus(row){
        if (!row) return;
        if (!row.pays) return 'Нет оплаты';

        const paysSum = row.pays.reduce((result, current) => result + current.sum, 0);

        if (paysSum === row.sum) return 'Оплачено';
        else if (paysSum < row.sum) return 'Недоплата';
    }

    getPositionNames(positions){
        return positions.reduce((final, current, i, arr) => {
            if (i !== arr.length - 1){
                return current.name + ', ' + final;
            } else {
                return final + current.name;
            }
        }, '')
    }

    onSelect(uid){
        const { selected } = this.props;
        let newArr = selected;

        if (!selected.includes(uid)){
            newArr.push(uid);
            this.props.selectItems(newArr);
        } else {
            newArr = newArr.filter(e => e !== uid);
            this.props.selectItems(newArr);
        }
    }

    render(){

        const { cheques, openDialog, deleteItems } = this.props;
        console.log(this.props)

        return(
            <React.Fragment>
                <AddChequeDialog />
                <div className="container">
                    <div className="buttonContainer">
                        <Button onClick={() => deleteItems()} style={{marginRight : 10}} disableElevation variant="contained" color="secondary">Удалить чек</Button>
                        <Button onClick={() => openDialog(true)} disableElevation variant="contained" color="primary">Добавить чек</Button>
                    </div>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead className="fixedHeader">
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell>Дата покупки</TableCell>
                                    <TableCell>Киоск</TableCell>
                                    <TableCell>Тип</TableCell>
                                    <TableCell>Статус оплаты</TableCell>
                                    <TableCell>Оплата</TableCell>
                                    <TableCell>Сумма</TableCell>
                                    <TableCell>Кол-во товара</TableCell>
                                    <TableCell className="fixedWidth">Товары</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cheques.map((row, index) => {
                                    return <TableRow className="tableRowClass" key={row.kioskName + row.sum + row.dateReg + index}>
                                        <TableCell>
                                            <Checkbox value={index} onChange={(e) => this.onSelect(row.uid)} />
                                            {/* <input type="checkbox" onChange={() => this.onSelect(row.uid)} /> */}
                                        </TableCell>
                                        <TableCell>{row.dateReg}</TableCell>
                                        <TableCell>{row.kioskName}</TableCell>
                                        <TableCell>{row.chequeType === 0 ? 'Продажа' : 'Возврат'}</TableCell>
                                        <TableCell>{this.getStatus(row)}</TableCell>
                                        <TableCell>{row.pays.reduce((sum, current) => sum + current.sum, 0)}</TableCell>
                                        <TableCell>{row.sum}</TableCell>
                                        <TableCell>{row.positions.reduce((sum, current) => sum + current.quantity, 0)}</TableCell>
                                        <TableCell className="fixedWidth">{this.getPositionNames(row.positions)}</TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
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
        },
        selectItems : function(items){
            dispatch(selectItems(items))
        },
        deleteItems : function(){
            dispatch(deleteItems())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Data);