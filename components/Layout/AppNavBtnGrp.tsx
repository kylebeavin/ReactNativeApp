import React, { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
    children: ReactElement<ReactNode>[];
}

const AppNavBtnGrp : React.FC<Props> = ({children}) => {
    return (
      <View>
        {/* Button NavStack */}
        <View style={styles.container}>

          {children.map((child, i) => {
            return (
              <View 
                key={i} 
                style={styles.buttonNavStackContainer}
              >
                {child}
              </View>
            )
          })}
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  //== Buttons NavStack ==
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 5,
    marginTop: 10,
  },
  buttonNavStackContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    marginRight: 10,
  },
});

export default AppNavBtnGrp;