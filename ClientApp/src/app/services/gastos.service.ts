import { Injectable } from '@angular/core';
import {Gasto, GastoData} from '../models/gasto'
import { Paginacion } from '../models/paginacion';

@Injectable({
  providedIn: 'root'
})
export class GastosService {

  private Gastos : Gasto[]
  constructor() { }

  Inicializar(): void {
    if(this.hayGastos()){
      this.inicializarGastosFromLocalStorage();
    }else{
      this.inicializarDummyGastos();
    }
  }

  private inicializarDummyGastos () : void{
      this.Gastos = [
        new Gasto(1 , "Alquiler" , "hogar" , "09/04/21" , 21000  , false , true , 1 ),
        new Gasto(2 , "Universidad" , "educativo" , "09/03/21" , 5000  , true , false , 0 ),
        new Gasto(3 , "Mercado" , "mercado" , "01/04/21" , 6000  , false , false , 0 ),
        new Gasto(4 , "Televisor" , "electrodomesticos" ,  "23/05/21" , 24000  , false , true , 1 ),
        new Gasto(5 , "Ubers" , "transporte", "02/02/21" , 2400  , true , true , 2 ),
        new Gasto(6 , "Mercado" , "mercado" , "09/03/21" , 8000  , true , false , 0 ),
        new Gasto(7 , "Alquiler" , "hogar",  "05/03/21" , 21000  , true , true , 1 ),
      ]
      this.saveChanges();
  }

  private inicializarGastosFromLocalStorage() {
    const gastosData = JSON.parse(localStorage.getItem('gastos_db'));
    this.Gastos = gastosData.map( gasto => new Gasto(gasto.id , gasto.description , gasto.categoria , gasto.date , gasto.price , gasto.pagado , gasto.compartido , gasto.compartidoEntre))
  }

  public getGastos() : Gasto[]{
    return this.Gastos;
  }

  public busqueda(terminoDescripcion: string , terminoCategoria : string){
    let gastosBuscados : Gasto[] = this.Gastos;

    if(terminoDescripcion !=="") gastosBuscados = gastosBuscados.filter( gasto => gasto.description.toLocaleLowerCase().trim().includes(terminoDescripcion));

    if(terminoCategoria !== "") gastosBuscados = gastosBuscados.filter( gasto => gasto.categoria === terminoCategoria)

    return gastosBuscados;
  }

  public buscarPorDescripcion(terminoDeBusqueda : string){
    return this.Gastos.filter( gasto => gasto.description.toLocaleLowerCase().trim().includes(terminoDeBusqueda.toLocaleLowerCase().trim()));
  }

  public busquedaPorCategoria(terminoDeBusqueda : string){
    return this.Gastos.filter( gasto => gasto.categoria === terminoDeBusqueda);
  }

  public borrarGastoPorId(id : number){
    this.Gastos = this.Gastos.filter( gasto => gasto.id !== id);
    this.saveChanges();
  }

  private generateId(){
    return Math.max.apply(Math, this.Gastos.map(function(gastos) { return gastos.id; })) + 1
  }

  public addGasto(gastoData : GastoData){
    const newGasto = new Gasto(this.generateId() , gastoData.description , this.convertCategoriaValue(gastoData.categoria) , gastoData.date , gastoData.price , gastoData.pagado , gastoData.compartido , gastoData.compartidoEntre);
    this.Gastos.push(newGasto);
    this.saveChanges();
  }

  public updateGasto(gastoData : GastoData , gastoId : number){
    const gasto : Gasto = this.Gastos.find(gasto => gasto.id === gastoId);
    for (const key in gastoData) {
        const newData = gastoData[key];    
        if(gasto[key] !== newData) gasto[key] = newData;   
    }
    this.saveChanges();
  }
  
  private saveChanges(){
    localStorage.setItem('gastos_db' , JSON.stringify(this.Gastos))
  }

  public getCurrentCategorias(){
    return [...new Set(this.Gastos.map(gasto => this.convertCategoriaValue(gasto.categoria)))]
  }

  public convertCategoriaValue(categoriaTipo : string){
    return categoriaTipo.toLowerCase().trim().replace(/\s+/g,' ');
  }

  public getGastosPage(paginacion : Paginacion){
    const inicio = paginacion.limit * (paginacion.page - 1);
    const fin = (paginacion.limit * (paginacion.page - 1)) + paginacion.limit
    return this.Gastos.slice(inicio, fin);
  }

  public getTotalNumberOfGastos(){
    return this.Gastos.length;
  }

  private hayGastos() : boolean{
    return localStorage.getItem('gastos_db') !== null && JSON.parse(localStorage.getItem('gastos_db')).length > 0
  }
}
