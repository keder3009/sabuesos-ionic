import { Pipe, PipeTransform } from '@angular/core';
import { IAdReport } from 'src/app/shared/types/report.interface';
import { ResponseInitNativeAdss } from 'capacitor-admob-keder';

@Pipe({
    name: 'filterAnimals',
})
export class FilterAnimalsPipe implements PipeTransform {
    transform(
        array: any[] = [],
        option: number = 0,
        column: string = 'title',
        adDataList: any[] = []
    ): any[] {
        if (!array || !Array.isArray(array)) {
            return [];
        }

        const optionFilter = option.toString();
        let reportList: any[] = [];
        let adIndex = 0;

        const filteredArray = array.filter(item =>
            item[column]?.toString() === optionFilter
        );

        // alert('adDataList: ' + adDataList.length);

        for (let i = 0; i < filteredArray.length; i++) {
            reportList.push(filteredArray[i]);

            if ((i + 1) % 6 === 0 && adDataList.length > 0) {
                let adData = adDataList[adIndex % adDataList.length];
                reportList.push({ ...adData, isAd: true });
                adIndex++;
            }
        }

        return reportList;
    }
}
