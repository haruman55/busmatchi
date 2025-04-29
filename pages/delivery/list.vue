<template>
  <v-container max-width="1200">
    <v-row no-gutters>
      <v-col>
        <v-breadcrumbs
:items="[
          { title: 'マイページ', disabled: true },
          { title: '案件管理', disabled: true },
          { title: '案件登録', disabled: false, to: '/user/order/entry' },
          { title: '運送引受会社選択', disabled: true },
        ]">
          <template #prepend>
            <v-icon icon="mdi-home" size="small" />
          </template>
          <template #divider>
            <v-icon icon="mdi-chevron-right" />
          </template>
        </v-breadcrumbs>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field v-model="deliveryLocation" label="配車場所" outlined :append-inner-icon="'mdi-magnify'" @click:append-inner="updateDeliveryLocationMarker"/>
        <!-- <v-textarea v-model="deliveryLocation" label="配車場所" rows="2" outlined :append-inner-icon="'mdi-magnify'" @click:append-inner="updateDeliveryLocationMarker"/> -->
        <!-- <v-checkbox v-model="deliveryChoice" label="配車場所からの経路で選択" /> -->
      </v-col>
    </v-row>

    <v-row >
      <v-col cols="12" md="8">
        <div ref="mapContainer" class="map-container" />
      </v-col>

      <v-col cols="12" md="4">
        <v-card v-if="destinationParkinInfo && destinationParkinInfo.companyName" flat>
          <v-card-title  class="text-h6 font-weight-bold">
            <a href="#" class="text-decoration-none" @click.prevent="selectDeliveryUser(destinationParkinInfo)">
              {{ destinationParkinInfo.companyName }}
            </a>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="indigo" class="mr-2">mdi-clock-outline</v-icon>
              {{ travelTime }}
            </div>
            <div class="d-flex align-center mt-2">
              <v-icon color="indigo" class="mr-2">mdi-map-marker-distance</v-icon>
              {{ travelDistance }}
            </div>
            <div class="d-flex align-center mt-2">
              <v-icon color="indigo" class="mr-2">mdi-map-marker</v-icon>
              {{ destinationParkinInfo.parkingAddr }}
            </div>
            <div class="d-flex align-center mt-2">
              <v-icon color="indigo" class="mr-2">mdi-phone-outline</v-icon>
              {{ destinationParkinInfo.companyTel }}
            </div>
            <div class="d-flex align-center mt-2">
              <v-icon color="indigo" class="mr-2">mdi-email-outline</v-icon>
              {{ destinationParkinInfo.companyEmail }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <br>
    <v-row >
      <v-col>
        <v-card>
          <v-card-title class="text-h6 font-weight-bold bg-background">運送引受会社一覧</v-card-title>
          <v-row justify="center" no-gutters>
            <v-col>
              <v-data-table
:headers="deliveryUserParkinParkinHeaders" :items="deliveryUerBusParkingList"
                class="text-pre-wrap bg-background">
                <template #[`item.companyName`]="{ item }">
                  <a href="" @click.prevent.stop="selectDeliveryItem(item)">
                    {{ item.companyName }}</a>
                </template>
              </v-data-table>

            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { Loader } from '@googlemaps/js-api-loader';

const router = useRouter()
const { $Const } = useNuxtApp()
const { $swal } = useNuxtApp()
const userData = useUserData();
// ログインユーザーのキーID
const { userInfo } = useUserInfo()
const keyUserId = userInfo.value.companyId


// 画面入力(設定)された申込情報を保持
const { orderInfo } = useOrderInfo()

/**
   * 運送引受会社情報取得
   */
const deliveryUserList = await userData.getDeliveryUser();

// 画面選択された申込運送引受会社情報を保持
const { orderDeliveryUserInfo, editOrderDeliveryUserInfo } = useOrderDeliveryUserInfo()

// 画面入力-Map選択可否
// const deliveryChoice = ref(false)

// 画面入力-配車場所
const deliveryLocation = ref(orderInfo.value.deliveryLocation)

/**
 * 運送会社保有の駐車場の一覧取得
 */
const getDeliveryUserParkingInfos = async () => {

  const deliveryUerBusParkingArray = []
  for (let i = 0; i < deliveryUserList.length; i++) {
    const companyId = deliveryUserList[i].companyId
    const parkingList = await userData.getParkingList(companyId)
    // const parkingArray = []
    for (let j = 0; j < parkingList.length; j++) {
      const parkingInfo = {
        companyId: deliveryUserList[i].companyId,
        companyName: deliveryUserList[i].companyName,
        companyAddr: deliveryUserList[i].companyAddr,
        companyEmail: deliveryUserList[i].companyEmail,
        companyFax: deliveryUserList[i].companyFax,
        companyTel: deliveryUserList[i].companyTel,
        parkingId: parkingList[j].id,
        parking: parkingList[j].parking,
        parkingAddr: parkingList[j].parkingAddr,
        remarks: parkingList[j].remarks,
      }
      deliveryUerBusParkingArray.push(parkingInfo)
    }
  }
  return deliveryUerBusParkingArray
}
const deliveryUerBusParkingList = await reactive(getDeliveryUserParkingInfos())


/** GoogleMap関連の定義 */
// Google Maps APIのロード
const apiKey = 'AIzaSyCWfa5BfqqpzkjLbgyl0iyWa-OUmg7W7xs';
const mapContainer = ref(null);
const map = ref(null);
const google = ref(null);
const directionsService = ref(null);
const directionsRenderer = ref(null);
const geocoder = ref(null);
const destination = ref('');
const destinationParkinInfo = ref({});
const travelTime = ref('');
const travelDistance = ref('');
const markers = ref([]);
// 配車場所のマーカー
const deliveryLocationMarker = ref(null);
// 目的地のマーカー
const destinationMarker = ref(null);
// 選択済みの目的地のマーカー
const selectedMarker = ref(null);


/**
 * Googleマップを生成する
 */
const initMap = async () => {
  try {
    const loader = new Loader({
      apiKey,
      libraries: ['places'],
    });

    google.value = await loader.load();

    map.value = new google.value.maps.Map(mapContainer.value, {
      center: { lat: 35.6895, lng: 139.6917 }, // デフォルトとして東京を中心に設定。但し初期値は配送先住所になる。
      zoom: 12,
    });

    directionsService.value = new google.value.maps.DirectionsService();
    directionsRenderer.value = new google.value.maps.DirectionsRenderer({
      suppressMarkers: true // デフォルトでマーカー(出発/目的地)に A / B とでるのを非表示
    });
    directionsRenderer.value.setMap(map.value);

    geocoder.value = new google.value.maps.Geocoder(); // Geocoding API のインスタンス

    // 配車場所のマーカーを設定
    if (deliveryLocation.value) {
      setDeliveryLocationMarker(deliveryLocation.value);
    }
    // 運送引受会社の駐車場をマーカーで表示
    addDestinationMarkers(map.value);
  } catch (error) {
    $swal.fire({
      text: 'Google Mapsの初期化に失敗しました。再読み込みしてください。',
      icon: 'error',
      confirmButtonText: 'OK',
    });
    console.error('Google Maps APIの初期化エラー:', error);
  }
}

/**
 * initMapから実行されGoogleマップ上に配車場所のマーカーを表示する
 * @param locationName 
 * @param mapInstance 
 */
const setDeliveryLocationMarker = (locationName) => {
  if (!locationName) {
    $swal.fire({
      text: '配車場所を入力してください。',
      icon: 'warning',
      confirmButtonText: 'OK',
    });
    return;
  }

  if (!map.value) return;

  geocoder.value.geocode({ address: locationName }, (results, status) => {
    if (status === google.value.maps.GeocoderStatus.OK && results[0]) {
      const location = results[0].geometry.location;

      // 以前選択されていたマーカーを赤色に戻す
      if (selectedMarker.value) {
        selectedMarker.value.setIcon({
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        });
      }

      // 既存のマーカーを削除(リセット)
      if (deliveryLocationMarker.value) {
        deliveryLocationMarker.value.setMap(null);
      }

      // マーカーの作成
      deliveryLocationMarker.value = new google.value.maps.Marker({
        position: location,
        map: map.value,
        title: '配車場所',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // 青のピン
        },
        label: {
          text: '配車場所', 
          color: 'red',
          fontWeight: 'bold',
        }
      });

      // 地図の中心を出発地に設定
      map.value.setCenter(location);
    } else {
      $swal.fire({
          text: '配車場所が特定できませんでした。住所など詳細情報を確認し入力してください。',
          showCancelButton: false,
          confirmButtonText: 'OK',
          icon: 'warning'
        })
        console.error(`Geocoding failed for ${place.parkingAddr}: ${status}`);
        return
    }
  });
};

/**
 * 配車場所を変更した際にマーカーを更新する
 */
const updateDeliveryLocationMarker = () => {
  if (google.value && geocoder.value) {
    // 既存のルート選択情報を初期化
    travelTime.value = ''
    destinationParkinInfo.value = null
    setDeliveryLocationMarker(deliveryLocation.value);
  }
};

/**
 * initMapから実行されGoogleマップ上に運送引受会社の駐車場のマーカーを表示する
 * @param mapInstance 
 */
const addDestinationMarkers = (mapInstance) => {
  markers.value.forEach(marker => marker.setMap(null)); // 既存のマーカーを削除
  markers.value = [];

  deliveryUerBusParkingList.forEach((place) => {
    geocoder.value.geocode({ address: place.parkingAddr }, (results, status) => {
      if (status === google.value.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;

        const marker = new google.value.maps.Marker({
          position: location,
          map: mapInstance,
          title: place.parkingAddr,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // 赤のピン
          },
        });

        marker.addListener('click', () => {
          destination.value = place.parkingAddr; // クリックしたら目的地をセット
          calculateRoute(location, mapInstance, place); // ルート検索を自動実行
        });

        markers.value.push(marker);
      } else {
        $swal.fire({
          text: '配車場所が特定できませんでした。住所など詳細情報を入力してください。',
          showCancelButton: false,
          confirmButtonText: 'OK',
          icon: 'warning'
        })
        console.error(`Geocoding failed for ${place.parkingAddr}: ${status}`);
        return

      }
    });
  });
};

/**
 * 選択したマーカーと配車場所との経路を計算する
 * @param destinationLatLng 
 * @param place 
 */
const calculateRoute = (destinationLatLng, mapInstance, place) => {
  if (!deliveryLocation.value) {
    $swal.fire({
      text: '配車場所を入力してください。',
      icon: 'warning',
      confirmButtonText: 'OK',
    });
    return;
  }
  mapInstance.setZoom(12);
  const request = {
    origin: deliveryLocation.value,
    destination: destinationLatLng,
    travelMode: google.value.maps.TravelMode.DRIVING,
  };

  directionsService.value.route(request, (result, status) => {
    if (status === google.value.maps.DirectionsStatus.OK) {
      directionsRenderer.value.setDirections(result);
      const leg = result.routes[0].legs[0];
      travelTime.value = leg.duration.text;
      travelDistance.value = leg.distance.text;
      destinationParkinInfo.value = place;

      // すべてのマーカーを赤に戻す
      markers.value.forEach(marker => {
        marker.setIcon({
          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        });
      });

      // 選択したマーカーのみ緑に変更
      const selected = markers.value.find(marker =>
        marker.getPosition().lat() === destinationLatLng.lat() &&
        marker.getPosition().lng() === destinationLatLng.lng()
      );
      if (selected) {
        selected.setIcon({
          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        });
        selectedMarker.value = selected; // 緑にしたマーカーを保存しておく
      }

      // 目的地マーカー（別の緑ピン）は表示しない方がスッキリしますが、必要なら残してください
      if (destinationMarker.value) {
        destinationMarker.value.setMap(null);
      }
    } else {
      $swal.fire({
        text: 'ルート検索に失敗しました。配車場所や目的地を確認してください。',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.log('ルート検索に失敗しました:' + deliveryLocation.value)
    }
  });
};

// マップの初期化
onMounted(initMap);


// 運送引受会社-駐車地のデータテーブルヘッダ定義
const deliveryUserParkinParkinHeaders = [
  {
    title: '運送引受会社名',
    key: 'companyName',
    sortable: true
  },
  {
    title: '駐車地',
    key: 'parking',
    sortable: true
  },
  {
    title: '駐車地住所',
    key: 'parkingAddr',
    sortable: true
  },

]




/**
 * 運送引受会社を選択する
 */
const selectDeliveryUser = async (item) => {
  let confirmRes = false
  await $swal.fire({
    text: '運送引受会社を選択します。よろしいですか？',
    showCancelButton: true,
    confirmButtonColor: "#00BCD4",
    cancelButtonColor: "#CFD8DC",
    confirmButtonText: 'はい。',
    cancelButtonText: 'キャンセル',
    icon: 'info'
  }).then((res) => {
    confirmRes = res.isConfirmed
  })
  if (!confirmRes) {
    return
  }
  const selectObject = {
    id: item.id,
    companyId: item.companyId,
    companyName: item.companyName,
    companyAddr: item.companyAddr,
    companyTel: item.companyTel,
    companyFax: item.companyFax,
    companyEmail: item.companyEmail,
    // TODO:保留(stateを分けた方が良い？)
    // parkingId: item.parkingId,
    // parking: item.parking,
    // parkingAddr: item.parkingAddr,
    // remarks: item.remarks,
    deliveryLocation: deliveryLocation.value,
    dispatchDate: orderDeliveryUserInfo.value.dispatchDate,
    dispatchTime: orderDeliveryUserInfo.value.dispatchTime,
    departureTime: orderDeliveryUserInfo.value.departureTime,
    // deliveryChoice: deliveryChoice,
  }
  // 画面設定値をStateへ情報保存
  editOrderDeliveryUserInfo(selectObject)

  // 画面遷移
  router.push('/user/order/entry')

}


/**
 * 一覧から運送引受会社を選択する
 */
 const selectDeliveryItem = async (item) => {
  if (!item.parkingAddr) {
    $swal.fire({
      text: '駐車地住所が設定されていません。',
      icon: 'warning',
      confirmButtonText: 'OK',
    });
    return;
  }

  // Geocodingを使って駐車地住所を緯度経度に変換
  geocoder.value.geocode({ address: item.parkingAddr }, (results, status) => {
    if (status === google.value.maps.GeocoderStatus.OK && results[0]) {
      const location = results[0].geometry.location;

      // 経路情報を計算して表示
      calculateRoute(location, map.value, item);

    } else {
      $swal.fire({
        text: '駐車地住所が特定できませんでした。住所を確認してください。',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      console.error(`Geocoding failed for ${item.parkingAddr}: ${status}`);
    }
  });
};
</script>

<style scoped>
.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.map-container {
  width: 100%;
  height: 500px;
}
</style>
