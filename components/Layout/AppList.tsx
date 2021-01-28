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
}

const AppList : React.FC<Props> = ({url, httpMethod, params}) => {
    const {status, data, error} = useFetch(url, httpMethod, (params ? params : undefined));
    const [isLoading, setIsLoading] = useState(true);
    const [listData, setListData] = useState<{}[]>([]);
    
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
                <Text style={{textAlign: 'center'}}>No Orders on this date.</Text>
              </View>
            ) : (
              listData.map((u: any, i: number) => {
                return (
                  <View style={styles.card} key={i}>

                    <View style={styles.title}>
                      <Text style={styles.titleText}>Name Here - {u.services}</Text>
                      <Text style={styles.titleText}>Status:
                        <Text style={{fontWeight: 'bold', color: Colors.SMT_Secondary_2_Light_1}}> On Schedule</Text>
                      </Text>
                    </View>

                    <View style={styles.btnContainer}>
                      <AppButton title="Details" onPress={() => console.log("Details")} />
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.SMT_Tertiary_1,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.SMT_Secondary_2_Light_1,
        borderRadius: 3,
        padding: 5,
      },
      title: {
        marginBottom: 10,
      },
      titleText: {
        fontWeight: 'bold',
      },
})

export default AppList;