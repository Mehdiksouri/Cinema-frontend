import { Component, OnInit } from '@angular/core';

import {CinemaService} from "../services/cinema.service";


@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes: any ; public cinemas: any;
  public currentVille: any ;
  public currentCinema: any;
   public salles: any;
   public currentProjection: any;
  public selectedTicket:any;


  constructor(public cinemaService:CinemaService) { }

  ngOnInit(): void {
  this.cinemaService.getVilles()
    .subscribe(data=>{
      this.villes=data;
    },err=>{
      console.log(err);
    })
  }
  onGetCinemas(v: any) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data;
      }, err => {
        console.log(err);

      })

  }


  onGetSalles(c: any) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles=data;
        this.salles._embedded.salles.forEach((salle: any)=>{
          this.cinemaService.getProjection(salle)
            .subscribe(data => {
              salle.projections= data;
            }, err => {
              console.log(err);
        })
        })
      }, err => {
        console.log(err);

      })

  }

  onGetTicketsPlaces(p: any) {
    this.currentProjection=p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data => {
        this.currentProjection.tickets = data
        this.selectedTicket=[];
      }, err => {
        console.log(err);
      })
  }
  onSelectTicket(t: any) {
    if(!t.selected){
      t.selected = true;
      this.selectedTicket.push(t);
    }
    else{
      t.selected = false;
      this.selectedTicket.splice(this.selectedTicket.indexOf(t), 1);
    }
  }

  getTicketClass(t: any){
    let str="btn ticket ";
    if(t.reservee){
      str += "btn-danger";
    } else if(t.selected){
      str += "btn-warning";
    }else{
      str += "btn-success";
    }
    return str;
  }
  onPayTicket(dataForm: any) {
    let tickets: any[];
    tickets = [];
    this.selectedTicket.forEach((t: { id: any; })=>{
      tickets.push(t.id);
    })
    dataForm.tickets=tickets;
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data => {
        alert("Ticket(s) réservé(s) avec succès!");
        this.onGetTicketsPlaces(this.currentProjection);
      }, err => {
        console.log(err);
      })
  }

}

