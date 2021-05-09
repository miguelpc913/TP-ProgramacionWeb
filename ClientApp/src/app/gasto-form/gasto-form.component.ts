import { Component, Input,  Output , EventEmitter ,  OnInit } from '@angular/core';
import { FormBuilder , FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Gasto, GastoData } from '../models/gasto';
import { GastosService } from '../services/gastos.service';


@Component({
  selector: 'app-gasto-form',
  templateUrl: './gasto-form.component.html',
  styleUrls: ['./gasto-form.component.css']
})
export class GastoFormComponent implements OnInit {

  @Input () gasto : Gasto;
  @Output () editarGasto = new EventEmitter();

  formGastos : FormGroup;
  categorias : string[];
  invalid : boolean = false;
  nuevaCategoria : boolean = false;
  nuevaCategoriaString : string = "Nueva Categoria";
  createGasto : boolean = false;
  datePattern : RegExp = /^([0-9]{2})\/([0-9]{2})\/([0-9]{2})$/;

  constructor(private GastoServ : GastosService,
              private fb: FormBuilder,
              private router:Router) { }

  ngOnInit() {
    this.GastoServ.Inicializar();
    this.createForm();
  }

  private createForm (){
    if(typeof this.gasto === "undefined"){
      this.gasto = new Gasto(0 , "" , "" , "" , 0 , true , false , 0);
      this.createGasto = true;
    }

    this.formGastos = this.fb.group({
      ...this.gasto,
      price: this.gasto.getPriceFull(),
      compartidoEntre : this.gasto.getCompartidoEntre(),
      nuevaCategoria: '',
      categoria: this.gasto.categoria === "" ? [null] : this.GastoServ.convertCategoriaValue(this.gasto.categoria),
    });

    this.categorias = this.GastoServ.getCurrentCategorias();
    this.categorias.push("Nueva Categoria")
  }

  private guardarPago(){
    const gastoData : GastoData  = this.CreateGastoData(Object.assign({},this.formGastos.value));
    this.invalid = !this.checkFormValidity(gastoData);
    if(!this.invalid){
      if(this.createGasto){
        this.GastoServ.addGasto(gastoData)
        this.router.navigate(["/"])
      }else{
        this.GastoServ.updateGasto(gastoData , this.gasto.id);
        this.editarGasto.emit()
      }
    }
  }

  private checkFormValidity(gastoData : GastoData) : boolean{
    const dataToCheck = this.parseDataToCheck(gastoData);
    for (const key in dataToCheck) {
      const element = gastoData[key];
      if (this.checkIfIsString(element , key)) {
        if(!this.isValidString(element , key)) return false
      } else {
        if(!this.isValidNumber(element , key)) return false
      }
    }

    return true;
  }

  private checkIfIsString(element: string , key: string) : boolean{
    return (isNaN(parseInt(element)) && typeof element === "string") || key === "date";
  }

  private isValidString(element: string , key: string) : boolean{
    return (key !== "date"  && element.trim().length > 0) || (key === "date" && this.datePattern.test(element));
  }

  private isValidNumber(element :string , key : string){
    let numberElement: number;
    if (key === "compartidoEntre") {
      numberElement = parseInt(element);
    } else {
      numberElement = parseFloat(element);
    }
    
    if (numberElement < 1) return false;

    return true;
  }

  private parseDataToCheck(gastoData){
    const dataToCheck = gastoData;
    if(!dataToCheck.compartido) delete dataToCheck.compartidoEntre;
    return dataToCheck;
  }

  private CreateGastoData(gastoData) : GastoData{
    if(this.nuevaCategoria) gastoData.categoria = gastoData.nuevaCategoria;
    delete gastoData.nuevaCategoria;
    delete gastoData.id;
    return gastoData;
  }

  private categoriaChange(){
    this.nuevaCategoria = this.formGastos.value.categoria === this.nuevaCategoriaString ? true : false;
  }

}
