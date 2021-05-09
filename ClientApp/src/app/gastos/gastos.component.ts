import { Component, OnInit } from '@angular/core';
import {GastosService} from '../services/gastos.service'
import {Gasto} from '../models/gasto'

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
export class GastosComponent implements OnInit {
  private gastos : Gasto[];
  private deudaTotal : number;
  private gastoTotal : number;
  private busquedaDescripcion : string;
  private busquedaPorDefault : string = "No filtrar por categoria";
  private filtrado : boolean = false;
  private busquedaCategoria : string;
  private categorias : string[];
  constructor(public gastosService : GastosService) { }

  ngOnInit() {
    this.gastosService.Inicializar();
    this.initState();
  }

  private initState(){ 
    this.gastos = this.gastosService.getGastos();
    this.busquedaCategoria = this.busquedaPorDefault;
    this.busquedaDescripcion = ""
    this.SetState();
    this.categorias = this.gastosService.getCurrentCategorias();
    this.categorias.push(this.busquedaPorDefault)
  }

  Busqueda(){
    const categoriaQuery : string = this.busquedaCategoria !== this.busquedaPorDefault ? this.busquedaCategoria : "";
    const descriptionQuery : string = typeof this.busquedaDescripcion !== "undefined" && (typeof this.busquedaDescripcion === "string" && this.busquedaDescripcion.trim().length > 0)  ? this.busquedaDescripcion.toLowerCase().trim() : "" 
    this.gastos = this.gastosService.busqueda(descriptionQuery , categoriaQuery);
    if(categoriaQuery !== "" && descriptionQuery !== ""){
      this.filtrado = true;
    }else{
      this.filtrado = false;
    }
    this.SetState();
  }

  BorrarGasto(gastoId:number){
    this.gastosService.borrarGastoPorId(gastoId);
    this.gastos = this.gastosService.getGastos();
    this.SetState()
  }

  EditarGasto(){
    this.gastos = this.gastosService.getGastos();
    this.initState()
    scroll({
      top: 0,
      behavior: "smooth"
    });
  }

  private SetState(){
    this.deudaTotal = this.calcularDeudaTotal();
    this.gastoTotal = this.calcularGastoTotal();
  }

  private calcularDeudaTotal () : number{
    return this.gastos.filter( gasto => !gasto.pagado).reduce( (total , current) => total + current.getPriceDivided() , 0 );
  }

  private calcularGastoTotal () : number{
    return this.gastos.filter( gasto => gasto.pagado).reduce( (total , current) => total + current.getPriceDivided() , 0 );
  }

}
