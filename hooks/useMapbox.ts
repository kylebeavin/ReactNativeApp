import React, {useContext} from 'react';
import Configs from "../constants/Configs";
import { ToastContext } from "../providers/ToastProvider";

const useMapbox = () => {
    const mapboxUri: string = 'https://api.mapbox.com';

    const getCoordinates = async (addresses: string[]) : Promise<number[][]> => {
        let addressList = formatAddresses(addresses);
        const coordsStore: any = [];
        
        let promises = addressList.map(async (u) => await fetch(`${mapboxUri}/geocoding/v5/mapbox.places/${u}.json?access_token=${Configs.MAPBOX_ACCESS_TOKEN}`));

        await Promise.all(promises)
          .then((responses) => {
            return Promise.all(
              responses.map(function (response) {
                return response.json();
              }),
            );
          })
          .then((data) => {
            data.forEach((curData) => {
              coordsStore.push(curData.features[0].center);
            });

            return new Promise((resolve) => {
              resolve(coordsStore);
            });
          }).catch((err) => err);

        return coordsStore;
    };

    const formatAddresses = (addresses: string[]) : string[] => {
        let formattedAddresses : string[] = [];
        
        if (addresses) {
            addresses.forEach(u => {
                let formattedString = u.split(' ').join('%20');
                let queryString = formattedString.replace(/,/g, '');
                formattedAddresses.push(queryString)
            });
        }

        return formattedAddresses;
    };

    return {
        getCoordinates
    };
}

export default useMapbox;