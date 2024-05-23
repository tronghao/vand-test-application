<template>
  <el-dialog
    class="w-[90%] md:w-[70%]"
    v-model="isShow"
    title="Detail pokemon"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <div v-if="pokemonData">
        <div class="aspect-w-1 aspect-h-1">
            <img class="mx-auto object-cover" :src="`${apiEndPoint}pokemons/${pokemonId}/sprite`" alt="">
        </div>
        <div>
            <el-table
                class="wordbreak-bread-word max-w-[100%] w-[50rem] mx-auto"
                :data="pokemonData"
                border
            >
                <el-table-column prop="label" header-align="center" align="left" label="Attribute" />
                <el-table-column prop="value" header-align="center" align="left" label="Value" />
            </el-table>
        </div>
    </div>
  </el-dialog>
  <Spinner :loading="loading" />
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch, emit } from "vue";
import Spinner from "@/components/Spinner";
import { showPokemon } from "@/api/v1/pokemons";
import { parseTime } from "@/utils";

export default {
  props: {
    isShowPopup: {
      type: Boolean,
      default: false,
    },
    pokemonId: {
      type: String,
      default: null,
    },
    typeList: {
      type: Array,
      default: null,
    },
  },
  components: {
    Spinner,
  },
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      isShow: props.isShowPopup,
      pokemonData: null,
      apiEndPoint: process.env.VUE_APP_API_ENDPOINT,
    });

    /**
     * capitalizeFirstLetter
     * @author HaoDT
     */
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * getList
     * @author HaoDT
     */
    const getList = async () => {
      try {
        state.loading = true;
        const {
          data: { data: pokemonData },
        } = await showPokemon(props.pokemonId);
        let dataArray = Object.entries(pokemonData).map(([key, value]) => ({ label: key, value }));
        const newData = [];
        dataArray.forEach(item => {
            if (item.label !== 'type_1' && item.label !== 'type_2') {
                if (item.label === 'created_at' || item.label === 'updated_at') {
                    item.value = parseTime(item.value, "{y}/{m}/{d} {h}:{i}");
                }
                if (item.label !== 'sp_atk' && item.label !== 'sp_def') {
                    item.label = capitalizeFirstLetter(item.label).replace('_', ' ');
                }
                newData.push(item);
            }

            if (item.label === 'type_1') {
                newData.push({
                    label: 'Type',
                    value: getTypeName(pokemonData),
                })
            }
        });
        state.pokemonData = newData;
        state.loading = false;
      } catch {
        state.loading = false;
      }
    };


    /**
     * getTypeName
     * @author HaoDT
     */
    const getTypeName = (row) => {
      const type = props.typeList.filter(item => [row.type_1, row.type_2].includes(item.id));
      const nameType = [];
      type.forEach(item => nameType.push(item.name));
      return type.length ? nameType.join(', ') : '';
    }

    /**
     * closeDialog
     * @author HaoDT
     */
    const closeDialog = (done) => {
      emit('update:isShowPopup', false);
      done();
    };

    onMounted(() => {
        if (props.pokemonId) {
            getList();
        }
    });

    return {
      ...toRefs(state),
      closeDialog,
    };
  },
};
</script>

<style lang="scss"></style>
