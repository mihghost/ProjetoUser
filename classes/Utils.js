
class Utils {

    static dateFormat(date) {//quando se usa o static não precisa-se do this 

        return this.addZero(date.getDate()) + '/' + this.addZero((date.getMonth() + 1)) + '/' + date.getFullYear() + ' ' + this.addZero(date.getHours()) + ':' + this.addZero(date.getMinutes());

    }

    static addZero(date) {//para adicionar o '0' antes na data

        return (date.toString().length == 1) ? '0' + date.toString() : date;
        
    }
}