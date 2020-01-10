/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator, Text } from 'react-native'
import { filter, findIndex } from 'lodash'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      accessToken: null,
    }
    this.updateItem = this.updateItem.bind(this)
  }

  componentDidMount = () => {
    this.getToken()
  }

  onDelete = async (url, id) => {
    let { accessToken, data } = this.state
    await fetch(`https://singer--sandbox.my.salesforce.com${url}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    const newData = filter(data, function(x) {
      return x.Id !== id
    })
    this.setState({
      data: newData,
    })
  }

  async getToken() {
    let response = await fetch(
      'https://test.salesforce.com/services/oauth2/token?password=singer@1234YxYMFHUQDxlS1h1uWgRGgXCn&client_secret=D2DCBC1360B6A983AAB7B7C8543BB90C8E60AA831B15D965CB6D5DC8D07CCDB9&client_id=3MVG9e2mBbZnmM6k4u_xbE0sSAFcj6BvAVUD4a2NO8po_PUhOQNTf9ZjDHcz7thhGuIrEP.bI33.sU7tP_xsx&username=nksahay-dkgu@force.com.sandbox&grant_type=password',
      {
        method: 'POST',
      }
    )
    response = await response.json()
    let accessToken = response.access_token
    response = await fetch(
      'https://singer--sandbox.my.salesforce.com/services/data/v45.0/query/?q=select+id,Part_Name__c,Spare_NAV_Code__c,Warehouse_Name__c,Job_Number__c,SF_ST_Name_Formula__c,Quantity__c+from+Spare_Part_Centre_Order__c',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    response = await response.json()
    this.setState({ data: response.records, accessToken })
  }

  extractItemKey = (item, index) => `${item.Id}`

  renderPosts = () => {
    if (this.state.data) {
      return (
        <FlatList
          data={this.state.data}
          keyExtractor={this.extractItemKey}
          renderItem={this.renderPostItem}
        />
      )
    } else {
      return (
        <View style={styles.spinnerView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
  }

  updateItem = (id, quantity) => {
    const { data } = this.state
    let index = findIndex(data, { Id: id })
    if (index !== -1) {
      data[index].Quantity__c = quantity
      this.setState({ data })
    }
  }

  renderPostItem = ({ item }) => {
    const { navigation } = this.props
    const { accessToken } = this.state
    return (
      <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
        <Text style={{ flex: 1 }}>{item.Spare_NAV_Code__c}</Text>
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={() =>
            navigation.navigate('Edit', { item, accessToken, updateItem: this.updateItem })
          }
        >
          <Text style={{ fontSize: 22 }}>&#9998;</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={() => this.onDelete(item.attributes.url, item.Id)}
        >
          <Text style={{ fontSize: 22 }}>&#10006;</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return <View style={styles.mainView}>{this.renderPosts()}</View>
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingHorizontal: 10,
  },
  spinnerView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
