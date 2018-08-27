import { Component, OnInit, OnChanges } from '@angular/core';
import { CreatePlacesServeice } from './create-places-in-hall.service';
import { isObject } from 'util';
import { MAX_LENGTH_VALIDATOR } from '@angular/forms/src/directives/validators';
@Component({
  selector: 'app-create-places-in-hall',
  templateUrl: './create-places-in-hall.component.html',
  styleUrls: ['./create-places-in-hall.component.scss']
})
export class CreatePlacesInHallComponent implements OnInit, OnChanges {

  dataSection:any = [];
  selectedElementId = 1;
  arrayWidthSection:any = [];
  idSelectedSectionForDiferentOperation:string = '';
  changeClassAfterClickEdit = false;
  idForSelectElementsAfterCreateThem = 1;
  memoryEvents = 1;
  needTitle = true;
  nowSelectedSetion = false;  
  
  
  // DATA FOR SECTION
  displayPanelsSettings = 'base-panel-with-tool';
  sectionNumber = 1;
  sectionSelect:string = 'Assigned Seating';
  sectionRows:number = 5;
  sectionSeats:number = 10;
  valueRotate = 0;
  valueSkew = 0;
  valueCurve = 1;

  // DATA FOR EDIT SECTION
  nameChairRow = '';
  nameSeat = '';
  idEditedSection = 0;
  idEditedChair = 0;
  editedObjectForPost:any;
  chosenAlign = 'justify';
  sectionCountRowName = 'Row';
  sectionCountSeatName = 'Seat';
  sectionTotalChair:number = 0;
  switcherClasswsBetweenLayoutAndLable = "layout";

  // DATA CURVE SECTION

  isMouseForCurveDown = false;
  arrBetween:any = [];
  firstElements:any = [];
  secondElements:any = [];
  countSeats;

  constructor(
    private myService: CreatePlacesServeice
  ) { }

  refreshDataSection(){
    this.myService.getDataSection().subscribe((data: any)=>{
      this.dataSection = data;
      this.pushAllSectionInArrayWidthSection(data.length)
    })
  }

  ngOnInit() {

    this.refreshDataSection()
    document.getElementById('container').style.height = window.innerHeight + 'px';
  }

  ngOnChanges(changes){
    if( changes.howManyIdOFSection && changes.howManyIdOFSection.currentValue ) {

    }

  }

  selectContainerMap(value){
    if( !this.nowSelectedSetion ){
      this.arrayWidthSection.map(a=>{
        document.getElementById(a).style.border = 'none';  
      });
      this.displayPanelsSettings = 'panel-setting-section';
    }
  }

  pushAllSectionInArrayWidthSection(legth){
    for (let i = 1; i < legth+1; i++) {
      this.arrayWidthSection.push( "section" + i);  
    }
  }

  switchDispalyPanelSettings(argument){
    this.displayPanelsSettings = argument;
  }
  
  createDataForSection(id){
    var idForChair = 1;
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l'];
    var object = {
      numberSection: this.sectionNumber,
      arrayWidthPlaces: []
    }
    var sectRow = Number(this.sectionRows)+1;
    var sectSeat = Number(this.sectionSeats)+1;
    var index = 1;
    while( index < sectRow ) {
      object.arrayWidthPlaces.push(
        {
          nameRow:alphabet[index-1].toUpperCase(),
          arrWithChair:[]
        }
      )
      index++;
    }
    object.arrayWidthPlaces.map(a=>{

      for (let i = 1; i < sectSeat; i++) {
        a.arrWithChair.push(
          {
            seat: i,
            selected: false,
            id: idForChair
          }
        )
        idForChair++;
      }
    })
    var dataId = 1
    this.myService.postDataSection(object).subscribe((data:any)=> {
      this.refreshDataSection()
      dataId = data.id;
    });
    this.sectionNumber++;
    this.switchDispalyPanelSettings('base-panel-with-tool');
    this.idForSelectElementsAfterCreateThem++;
    console.log( this.sectionSeats )
  }

  duplicateSection(){
    var arr = this.dataSection.filter(a=>a.id === this.idSelectedSectionForDiferentOperation);
    arr = arr[0];
    arr.numberSection = this.sectionNumber;
    delete arr.id;
    this.myService.postDataSection(arr).subscribe((data:any)=> {
      this.refreshDataSection()
    });
  } 
  
  





  // FUNCTIONAL ROTATE SECTION
  valueSkewElements = 0;
  fixedValueRotate = 0;

  sliderMouseMove(value){
    this.fixedValueRotate = value
    var id = this.idSelectedSectionForDiferentOperation;
    var slider = document.getElementById('section'+id);
    slider.style.transform = 'rotate(' + value + 'deg)';
    var elements:any = slider.getElementsByTagName('DIV');
    var arrWithElements:any = [];
    for (let i = 0; i < elements.length; i++) {
      arrWithElements.push( elements[i] )    
    }
    arrWithElements.map(a=>{
      if( a.className != 'block-for-data-row' && a.className != 'rows' ) {
        a.style.transform = 'rotate(' + (-value) + 'deg)' 
      }
    })
    arrWithElements.map(a=>{
      if( a.className != 'block-for-data-row'
        && a.className != 'rows' 
        && a.className != 'name-section'
        && a.className != 'cheir-span' 
        && a.className != 'row-span' ) {
        a.style.transform = 'skewY(' + -this.valueSkewElements + 'deg)'
      }
      // if( a.className != 'content-for-chair' ) a.style.transform = 'skewY(' + 0 + 'deg)'
    })
    
  }



  // FUNCTIONAL SKEW SECTION

  skewSection(value){
    var id = this.idSelectedSectionForDiferentOperation;
    var slider = document.getElementById('section'+id);
    var elements:any = slider.getElementsByTagName('DIV');
    var arrWithElements:any = [];
    for (let i = 0; i < elements.length; i++) {
      arrWithElements.push( elements[i] )    
    }
    arrWithElements.map(a=>{
      if(a.className != "rows-edit" && a.className != 'name-section-edit' && a.className != 'content-for-chair' ) {
        if( a.className === 'block-for-data-row' ) {
          a.style.transform = 'skewY(' + value + 'deg)'
          this.valueSkewElements = value;
        } else if( a.className != 'cheir-span' && a.className != 'row-span' ) a.style.transform = 'skewY(' + -value + 'deg)'
      }
    })
  }







  // FUNCTIONAL MOVE SECTION


  isMouseDown = false;
  contX = 0;
  contY = 0;
  idElem;

  functionForDownSection(e, id){
    this.selectedSection(id)
    this.idElem = "section" + id;
  	this.contX = (e.clientX - document.getElementById(this.idElem).offsetLeft + document.getElementById('map').offsetLeft );
    this.contY = (e.clientY - document.getElementById(this.idElem).offsetTop + document.getElementById('map').offsetTop - 0 );
    this.isMouseDown = true;
  }

  selectedSection(id){
    this.nowSelectedSetion = true;
    this.idSelectedSectionForDiferentOperation = id;
    this.arrayWidthSection.map(a=>{
      if( a === ("section"+id) && this.changeClassAfterClickEdit != true ){
        document.getElementById(a).style.border = '3px dashed #0093D7';
      } else document.getElementById(a).style.border = 'none';  
    })
    if( this.displayPanelsSettings != 'editing-cair-settings' && this.displayPanelsSettings != 'panel-edit-section' ) {
      this.displayPanelsSettings = 'panel-setting-object-section';
    }

    this.howManySeatAndRowTogether()
  }

  howManySeatAndRowTogether(){
    var arr = this.dataSection.filter(data => data.id === this.idSelectedSectionForDiferentOperation);
    arr = arr[0];
    var arrPlaces = arr.arrayWidthPlaces;
    this.sectionTotalChair = 0;
    for (let i = 0; i < arrPlaces.length; i++) {
      this.sectionTotalChair += arrPlaces[i].arrWithChair.length
    }
  }

  changeCountSetAndRow(){
    var idForChair = 1;
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var object = {
      numberSection: this.sectionNumber,
      arrayWidthPlaces: [],
      id: this.idSelectedSectionForDiferentOperation
    }
    var sectRow = Number(this.sectionRows)+1;
    var sectSeat = Number(this.sectionSeats)+1;
    var index = 1;
    while( index < sectRow ) {
      object.arrayWidthPlaces.push(
        {
          nameRow:alphabet[index-1].toUpperCase(),
          arrWithChair:[]
        }
      )
      index++;
    }
    object.arrayWidthPlaces.map(a=>{

      for (let i = 1; i < sectSeat; i++) {
        a.arrWithChair.push(
          {
            seat: i,
            selected: false,
            id: idForChair
          }
        )
        idForChair++;
      }
    })
    this.dataSection[Number(this.idSelectedSectionForDiferentOperation) - 1 ] = object;
    console.log( this.dataSection )
    this.howManySeatAndRowTogether()
    this.arrBetween = [];
    this.firstElements = [];
    this.secondElements = [];
  }

  functionForUpSection(){
    	this.isMouseDown = false;
  }

  functionForMoveSection(e) {
  	if( this.isMouseDown ){
      var x = e.clientX;
      var y = e.clientY;
      document.getElementById(this.idElem).style.marginTop = y - this.contY + 'px';
      document.getElementById(this.idElem).style.marginLeft = x - this.contX + 'px';
    }
  }






  // FUNCTIONS FOR EDIT SECTION

  changeViewMapAndSection(){
    var map = document.getElementById('map');
    var section = document.getElementById('section' + this.idSelectedSectionForDiferentOperation);
    section.style.border = 'none';
    map.style.background = 'rgba(0,0,0,0.65)';
    section.style.pointerEvents = 'none';
    this.changeClassAfterClickEdit = true;
    this.displayPanelsSettings = 'panel-edit-section';
    this.needTitle = false;
  }

  changeViewBack(){
    var map = document.getElementById('map');
    var section = document.getElementById('section' + this.idSelectedSectionForDiferentOperation);
    section.style.border = '';
    map.style.background = 'rgba(0,0,0,0.04)';
    section.style.pointerEvents = 'all';
    this.changeClassAfterClickEdit = false;
    this.displayPanelsSettings = 'base-panel-with-tool';
    this.needTitle = true;
  }
  
  selectChair(idSection, idCair, event){
    console.log( event   );
    this.idEditedSection = idSection;
    this.idEditedChair = idCair;
    this.displayPanelsSettings = 'editing-cair-settings';
    var arr = this.dataSection.filter(data => data.id === idSection)[0];
    arr.arrayWidthPlaces.map(a=>{
      a.arrWithChair.map(data=>{
        if( data.id === idCair ) {
          data.selected = true;
          this.nameSeat = data.seat;
          this.nameChairRow = a.nameRow;
        }
      })
    })
    this.editedObjectForPost = arr;
  }

  editDataChair(){
    var editedChairObject = {
      seat: this.nameSeat,
      selected: true,
      id:this.idEditedChair
    }
    var arr = this.dataSection.filter(data => data.id === this.idEditedSection)[0];
    arr.arrayWidthPlaces.map(a=>{
      a.arrWithChair.map(data=>{
        if( data.id === this.idEditedChair ){
          a.nameRow = this.nameChairRow;
          a.arrWithChair[a.arrWithChair.indexOf(data)].seat = this.nameSeat;
          a.arrWithChair[a.arrWithChair.indexOf(data)].id = this.idEditedChair;
        } 
      })
    })
    // this.sliderMouseMove(this.fixedValueRotate)
  }
  
  postEditedObject(){
    this.dataSection.map(a=>{
      if( a.id === this.editedObjectForPost.id ) {
        a.arrayWidthPlaces.map(data =>{
          data.arrWithChair.map(chair=>{
            chair.selected = false;
          })
        })
      }
    });
    this.displayPanelsSettings = 'panel-edit-section';
  }

  deleteChair(){
    var arr = this.dataSection.filter(data => data.id === this.idEditedSection);
    arr = arr[0];
    arr.arrayWidthPlaces.map(a=>{
      a.arrWithChair.map(data=>{
        if( data.id === this.idEditedChair ){
          a.arrWithChair.splice( 
            a.arrWithChair.indexOf(data),
            1
          )
        } 
      })
    })
    this.myService.updateSections(arr.id , arr).subscribe(data => {
      console.log( data )
      this.refreshDataSection()
    })
  }








  // FUNCTION DELETE SECTOIN

  deleteSelectedSection(){
    if( this.idSelectedSectionForDiferentOperation != '' ) {
      var idElements =  this.arrayWidthSection.indexOf('section' + this.idSelectedSectionForDiferentOperation);
      this.arrayWidthSection.splice( idElements , 1 )
      this.myService.deleleSection(this.idSelectedSectionForDiferentOperation)
      .subscribe(data=>this.refreshDataSection())
    }
    this.displayPanelsSettings = 'base-panel-with-tool';
  }

  resizeInput(e){
    var inputs = document.getElementsByTagName('INPUT');
    var arr = [];
    for (let i = 0; i < inputs.length; i++) {
      arr.push( inputs[i] )      
    }
    arr.map(a=>{
      if( a.className === e.target.className ) { 
        if( e.target.value.length != 0 ) a.style.width = (e.target.value.length * 20) + 'px';
        else a.style.width = 20 + 'px';
      }
    })
  }

  changeAlignment(arg){
    this.chosenAlign = arg;
  }
  
  
  
  // FUNCTIONAL FOR CURVE SECTION

  downMouceForCurve(){
    this.isMouseForCurveDown = true;
    if( this.arrBetween.length === 0 ){
      var id = Number(this.idSelectedSectionForDiferentOperation);
      this.countSeats = this.dataSection[id-1].arrayWidthPlaces[0].arrWithChair.length;
      var index = 0;
      var slider = document.getElementById('section'+id);
      var elements:any = slider.getElementsByTagName('DIV')
      var arrWithElements:any = [];
      for (let i = 0; i < elements.length; i++) {
        arrWithElements.push( elements[i] )    
      }
      arrWithElements.map(a=>{
        if( a.className === "cheirEdit" ){
          index++;
          this.arrBetween.push(a);
        }
      })
      var seatOnTwo = Math.round(this.countSeats/2);
      for (let i = 0; i < this.arrBetween.length; i++) {
        if( i === seatOnTwo ) {
          i += Math.floor(this.countSeats/2);
          seatOnTwo += this.countSeats;
          console.log( this.arrBetween[i] )
        }
        this.firstElements.push( this.arrBetween[i] );
      }
      this.arrBetween = this.arrBetween.reverse();
      seatOnTwo = Math.round(this.countSeats/2);
      for (let i = 0; i < this.arrBetween.length; i++) {
        if( i === seatOnTwo ) {
          i += Math.floor(this.countSeats/2);
          seatOnTwo += this.countSeats;
        }
        this.secondElements.push( this.arrBetween[i] );
      }
      this.firstElements.splice( this.firstElements.indexOf(undefined) );
      this.secondElements.splice( this.secondElements.indexOf(undefined) ).reverse();
      console.log( this.secondElements , this.firstElements )
    }
    
  }

  upMouseForCurve(){
    this.isMouseForCurveDown = false;
  }

  curveSection(value){
    if( this.isMouseForCurveDown ){
      var valueNumb = Number(value);
      var index = Math.floor(this.countSeats/2);
      var checkValue = Math.round(this.countSeats/2)-1;
      var checkLastElement = Math.floor(this.countSeats/2);
      for (let i = 0; i < this.firstElements.length; i++) {
        if( value < 0 ){
          this.firstElements[i].style.marginBottom = (index + valueNumb  + "px");
          index += valueNumb;
          if( i === checkValue ) {
            index = Math.round(this.countSeats/2)
            checkValue += Math.round(this.countSeats/2)
            var marginOtherElements1:any = (Number(this.firstElements[i-1].style.marginBottom.match( /\d+/g ).join('')) -
            Math.floor( valueNumb/3 )) + 'px';
            this.firstElements[i].style.marginBottom = '-' + marginOtherElements1;
          };
        } else {
          var sum:any = (index + valueNumb + "px");
          this.firstElements[i].style.marginTop = '-' + sum;
          index += valueNumb;
          sum = '';
          if( i === checkValue ) {
            index = Math.round(this.countSeats/2)
            checkValue += Math.round(this.countSeats/2)
            var marginOtherElements2:any = (Number(this.firstElements[i-1].style.marginTop.match( /\d+/g ).join('')) +
            Math.floor( valueNumb/3 )) + 'px';
            this.firstElements[i].style.marginTop = '-' + marginOtherElements2;
          };
        }
          
      }
      index = Math.floor(this.countSeats/2);
      checkValue = Math.round(this.countSeats/2)-1;
      var checkLastElement = Math.floor(this.countSeats/2);
      for (let i = 0; i < this.secondElements.length; i++) {
        if( value <= 0 ) {
          this.secondElements[i].style.marginBottom = ( index + valueNumb + "px");
          index = index + valueNumb;
          if( i === checkValue ) {
            index = Math.round(this.countSeats/2);
            checkValue += Math.round(this.countSeats/2);
            var marginOtherElements1:any = (Number(this.secondElements[i-1].style.marginBottom.match( /\d+/g ).join('')) -
            Math.floor( valueNumb/3 )) + 'px';
            this.secondElements[i].style.marginBottom = '-' + marginOtherElements1;
          };
        } else {
          var sum:any = (index + valueNumb + "px");
          this.secondElements[i].style.marginTop = '-' + sum;
          index = index + valueNumb;
          sum = '';
          if( i === checkValue ) {
            index = Math.round(this.countSeats/2);
            checkValue += Math.round(this.countSeats/2);
            var marginOtherElements2:any = (Number(this.secondElements[i-1].style.marginTop.match( /\d+/g ).join('')) + 
            Math.floor( valueNumb/3 )) + 'px';
            this.secondElements[i].style.marginTop = '-' + marginOtherElements2;
          };
        }
          
      }
    }
  }
}