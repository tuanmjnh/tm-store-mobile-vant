<template>
  <q-layout v-if="!$store.state.auth.user" view="lHh Lpr lFf" :class="$q.dark.isActive?'':'bg-gradient'">
    <!-- <div v-if="!$store.state.auth.user" class="window-height window-width row justify-center items-center"> -->
    <div :class="`window-from window-width row justify-center items-center ${$store.state.auth.loading?'hidden':''}`">
      <div class="col-10 col-md-4">
        <div class="text-center q-mb-md bg-w">
          <img :src="$store.getters.iconApp">
          <span class="text-h6 text-white">{{title}}</span>
        </div>
        <q-form ref="form">
          <q-card class="q-pb-md q-pt-md">
            <q-card-section>
              <div class="row">
                <div class="col-auto q-pl-sm">
                  <q-toggle v-model="darkMode" label="Dark mode" size="xs" color="blue-grey"
                            :class="['text-no-wrap',$store.getters.darkMode?'':'q-toggle-setting']" />
                </div>
                <q-space />
                <div class="col-auto">
                  <q-btn-dropdown flat no-caps dense :color="$store.getters.darkMode?'':'blue-grey'">
                    <template v-slot:label>
                      <div class="row items-center no-wrap">
                        <span :class="`fi fi-${$store.getters.language}`" />
                      </div>
                    </template>
                    <q-list dense class="btn-language-list">
                      <template v-for="(e,i) in languages" :key="i">
                        <q-item :active="`${e.cc_iso}-${e.cc}`===$store.getters.language?true:false" clickable v-close-popup
                                @click="onSetLanguage(e)">
                          <q-item-section avatar><span :class="`fi fi-${e.cc_iso}-${e.cc}`" /></q-item-section>
                          <q-item-section>{{e.name_l}}</q-item-section>
                        </q-item>
                      </template>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="q-pl-md q-pr-md">
                <q-input v-model.trim="data.username" :dense="$store.getters.dense.input" v-lowerCase
                         :placeholder="$t('login.username')" :rules="[v=>v&&v.length>0||$t('error.required')]" />
              </div>
              <div class="q-pl-md q-pr-md q-pt-md">
                <q-input v-model.trim="data.password" :type="passwordType" :dense="$store.getters.dense.input"
                         :placeholder="$t('login.password')" @keyup="onCheckCapslock" @blur="isCapsTooltip=false"
                         :rules="[v=>v&&v.length>0||$t('error.required')]" class="capsTooltip">
                  <template v-slot:append>
                    <q-icon v-if="passwordType==='password'" name="visibility_off" @click="passwordType='text'" class="cursor-pointer" />
                    <q-icon v-else name="visibility" @click="passwordType='password'" class="cursor-pointer" />
                    <q-tooltip v-model="isCapsTooltip" :no-parent-event="true" :offset="[10,10]" content-class="bg-indigo">
                      Caps lock
                    </q-tooltip>
                  </template>
                </q-input>
              </div>
              <div class="q-pl-xs q-pr-md q-pt-md">
                <q-checkbox v-model="data.remember" :label="$t('login.remember')" />
              </div>
            </q-card-section>
            <!-- <q-separator dark inset /> -->
            <q-card-actions align="center">
              <q-btn type="submit" class="q-btn--square" no-caps color="blue" :label="$t('login.login')" :loading="$store.getters.loading.post"
                     :disable="$store.getters.loading.post" @click.prevent="onSubmit">
                <!-- <q-tooltip>{{$t('global.add')}}</q-tooltip> -->
              </q-btn>
              <!-- <div class="brand-color text-center row inline flex-center text-white bg-primary">{{$t('login.login')}}</div> -->
              <!-- <q-btn flat>Action 2</q-btn> -->
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-layout>
</template>

<script>
// import * as apiUserSetting from '@/api/users/setting'
import { defineComponent, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'LoginLayout',
  // components: {
  //   loading: defineAsyncComponent(() => import('../loading/index.vue'))
  // },
  setup() {
    // library core
    const $route = useRoute()
    const $router = useRouter()
    const $store = useStore()
    const $q = useQuasar()

    // Data
    const title = process.env.APP_NAME
    const languages = computed(() => $store.getters.languages)
    const language = computed(() => { return languages.value.find(x => `${x.cc_iso}-${x.cc}` === $store.getters.language) })
    const darkMode = computed({
      // getter
      get: () => {
        return $q.dark.isActive
      },
      // setter
      set: (val) => {
        $q.dark.set(val)
        $store.dispatch('settings/set', { darkMode: val })
      }
    })
    const form = ref(null)
    const data = ref({
      username: '',
      password: '',
      remember: true
    })
    const passwordType = ref('password')
    const isCapsTooltip = ref(false)
    // Return data for html
    const onSetGlobalData = () => {
      return new Promise(async (resolve, reject) => {
        if ($store.state.auth.user) {
          if (!$store.state.types.items) await $store.dispatch('types/getAll')// .then(() => { console.log(store.state.types.items) })
          // if (!$store.state.roles.items) await $store.dispatch('roles/getAll')// .then(() => { console.log(store.state.roles.items) })
        }
        return resolve(true)
      })
    }
    return {
      title, form, data, passwordType, isCapsTooltip, languages, darkMode,
      onSetLanguage(item) {
        if (language.value !== item) {
          // locale.value = data.language
          // document.querySelector('html').setAttribute('lang', locale.value)
          $store.dispatch('settings/set', { language: `${item.cc_iso}-${item.cc}` })
        }
      },
      onCheckCapslock: ({ shiftKey, key } = {}) => {
        if (key && key.length === 1) {
          if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) isCapsTooltip.value = true
          else isCapsTooltip.value = false
        }
        if (key === 'CapsLock' && isCapsTooltip.value === true) isCapsTooltip.value = false
      },
      validEmail: (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
      },
      onSubmit: async () => {
        form.value.validate().then(valid => {
          if (valid) {
            $store.dispatch('auth/verify', data.value).then(async rs => {
              if (rs) {
                const redirect = $route.query && $route.query.redirect ? $route.query.redirect : '/'
                $router.push(redirect).catch((e) => { })
                await onSetGlobalData()
              }
            })
          }
        })
      }
    }
  }
})
</script>

<style scoped>
.bg-gradient {
  background-image: linear-gradient(120deg, #3498db, #8e44ad);
}
.q-layout img {
  position: relative;
  top: 8px;
  left: -8px;
}
.q-layout .text-h6 {
  text-shadow: 2px 2px #262626;
}
.window-from {
  padding-top: 110px;
}
.q-btn--square {
  padding: 6px 36px !important;
}
</style>
