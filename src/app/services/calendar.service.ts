import { Injectable } from '@angular/core';
import * as moment from "moment/moment";
import {IDate} from "../interfaces/date-array.interfase";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // Regex validate that days isn't greater than 31, months isn't greater than 12 and date isn't greater than today date, also validate leap-year
  private readonly DATE_REGEX = /^(0[1-9]|[1-2]\d|3[01])(\/)(0[1-9]|1[012])\2(\d{4})$/;

  constructor() { }

  /**
   * Check if date is valid
   * @param dateString
   */
  public checkIsDateValid(dateString: string){
    if(!dateString.match(this.DATE_REGEX)){
      return false;
    }
    const date: IDate = this.splitDateString(dateString);
    const day = parseInt(date.day);
    const month = parseInt(date.month);
    const year = parseInt(date.year);
    const monthDays = new Date(year, month, 0).getDate();
    if(day > monthDays) {
      return false;
    }
    if(moment(new Date()).diff(dateString, 'days') < 0){
      return false;
    }
    return true;
  }

  /**
   * Separate years, days, months from date string
   * @param dateString
   */
  public splitDateString(dateString: string): IDate{
    return {
      year: dateString.split('/')[2],
      month: dateString.split('/')[1],
      day: dateString.split('/')[0]
    }
  }

  /**
   * Convert string to date
   * @param date
   */
  public convertStringToDate(date: IDate){
    let dateReturn = new Date(date.year + '-' + date.month + '-' + date.day);
    return dateReturn.setMinutes(dateReturn.getMinutes() + dateReturn.getTimezoneOffset());
  }

}
