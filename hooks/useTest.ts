import React, {useContext} from 'react';

import Configs from "../constants/Configs";
import AppContext from "../providers/AppContext";
import { Route } from '../types/routes';
import { Order } from '../types/orders';
import { isSuccessStatusCode } from '../utils/Helpers';

const useTest = () => {
    const {grpId, token} = useContext(AppContext);

    const generateTestRouteWithStops = async (num = 10) => {
        let data: Order[] = [];
        let addresses = [
            '7279 N Keystone Ave, Indianapolis, IN 46240',
            '7000 Graham Rd, Indianapolis, IN 46220',
            '6061 E 82nd St, Indianapolis, IN 46250',
            '9833 Fall Creek Rd, Indianapolis, IN 46256',
            '10955 Pendleton Pike, Lawrence, IN 46236',
            '3745 N Post Rd, Indianapolis, IN 46226',
            '7190 Pendleton Pike, Indianapolis, IN 46226',
            '1934 Shadeland Ave, Indianapolis, IN 46219',
            '2425 E 38th St, Indianapolis, IN 46218',
            '5199 N Keystone Ave, Indianapolis, IN 46205'
        ];
        console.log('start loop')
        for (var i = 0; i < num; i++) {
            let newOrder: Order = {
                _id: '',
                account_id: '6054e53ef2d3b0225c10e2fa',
                container_qty: 1,
                demand_rate: num.toString(),
                group_id: '6054d9b5c4b3610fc47d090c',
                haul_status: false,
                is_active: true,
                is_demo: false,
                is_recurring: true,
                monthly_rate: num.toString(),
                location: addresses[i],
                notes: ['Generated Order'],
                order_id: '',
                order_status: 'not started',
                services: 'smash',
                service_date: new Date().toLocaleDateString(),
                service_day: 'fri',
                service_frequency: 'day',
                url: [],
                account_name: ''
            };

            await fetch(`${Configs.TCMC_URI}/api/orders`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json', 'x-access-token': token},
                body: JSON.stringify(newOrder)
            })
            .then(res => res.json())
            .then(json => {
                if (isSuccessStatusCode(json.status)) {
                    console.log(json.message);
                    data.push(json.data);
                } else {
                    console.log(json.message);
                }
            })
            .catch(err => console.log('err'));
        }

        let stpArr: string[] = [];
        data.forEach(u => stpArr.push(u._id))

        let route: Route = {
            _id: '',
            group_id: '6054d9b5c4b3610fc47d090c',
            route_id: '',
            inspection_id: '',
            is_active: true,
            route_stage: 'Empty',
            start_location: '11708 n college ave, carmel, in 46032',
            truck_vin: 'not important',
            service_stop: stpArr,
            time: new Date(),
            notes: 'Generated Route',
        }

        await fetch(`${Configs.TCMC_URI}/api/routes`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'x-access-token': token},
            body: JSON.stringify(route)
        })
        .then(res => res.json())
        .then(json => {
            if (isSuccessStatusCode(json.status)) {
                console.log(json.message);
            } else {
                console.log(json.message);
            }
        })
        .catch(err => console.log('err'));

    };

    return {
        generateTestRouteWithStops,
    };
};

export default useTest;