//import * as Linking from 'expo-linking';

export default {
  //prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          CRM: {
            screens: {
              AccountsScreen: 'one',
              MeetingsScreen: 'two',
              MapScreen: 'three',
            },
          },
          Services: {
            screens: {
              ServicesScreen: 'two',
            },
          },
          Routes: {
            screens: {
              RoutesScreen: 'three',
            },
          },
          Invoices: {
            screens: {
              InvoicesScreen: 'four',
            },
          },
          Reports: {
            screens: {
              ReportsScreen: 'five',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
