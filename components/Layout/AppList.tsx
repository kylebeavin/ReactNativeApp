import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useFetch } from '../../hooks/useFetch';
import { getDateStringsFromDate } from '../../utils/Helpers';
import AppButton from './AppButton';

interface Props {
    url: string;
    httpMethod: string;
    params?: {};
    renderItem: (u: any, i: number) => {};
}

const AppList : React.FC<Props> = ({url, httpMethod, params, renderItem}) => {
    const {status, data, error} = useFetch(url, httpMethod, (params ? params : undefined));
    const [isLoading, setIsLoading] = useState(true);
    const [listData, setListData] = useState<{}[]>([]);
    console.log('hi')
    useEffect(() => {
        if (status === "fetched") {
            getData();
        }
    }, [status, data]);

    const getData = () => {
        setListData(data.data);
        setIsLoading(false);
    };

    return (
        <View>
        {isLoading ? (
          <ActivityIndicator color={Colors.SMT_Primary_2} animating={true} />
        ) : (
          <View>
            {/* OrdersCalendar List */}
            {listData.length === 0 ? (
              // <AppEmptyCard entity="orders" modal="CreateOrderModal" />
              <View>
                <Text style={{textAlign: 'center'}}>No Items on this date.</Text>
              </View>
            ) : (
              listData.map((u: any, i: number) => {
                return renderItem(u, i)
              })
            )}
          </View>
        )}
        </View>
    );
}

const styles = StyleSheet.create({

})

export default AppList;