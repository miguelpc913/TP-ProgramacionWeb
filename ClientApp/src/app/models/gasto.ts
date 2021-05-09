export class Gasto {
    id: number;
    description: string;
    date: string;
    private price: number;
    pagado: boolean;
    compartido: boolean;
    private compartidoEntre: number;
    categoria : string;

    constructor(id : number , description : string , categoria : string , date : string , price : number ,pagado : boolean , compartido : boolean , compartidoEntre : number){
        this.id = id;
        this.description = description;
        this.date = date;
        this.categoria = categoria;
        this.pagado = pagado;
        this.compartido = compartido;
        this.setCompartidoEntre(compartidoEntre);
        this.setPrice(price);
    }

    public getPriceDivided () : number{
        if(this.compartido && this.compartidoEntre > 0){
           return this.price / (this.compartidoEntre + 1)
        }else{
            return this.price;
        }
    }

    public getPriceFull () : number{
        return this.price;
    }

    private setPrice (price : number){
        if(price > 0){
            this.price = price;
        }
    }

    public setCompartidoEntre (compartidoEntre : number){
        if(compartidoEntre > 0){
            this.compartidoEntre = compartidoEntre;
        }
    }

    public getCompartidoEntre() : number{
        return this.compartidoEntre;
    }

}

export interface GastoData{
    description: string;
    date: string;
    price: number;
    pagado: boolean;
    compartido: boolean;
    compartidoEntre: number;
    categoria : string;
}


