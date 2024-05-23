<template>
  <!-- header title -->
  <div class="text-center font-bold">POKEMON LIST</div>
  <hr class="my-5" />
  <div>
    <!-- filter -->
    <div class="flex items-center gap-2">
      <div>Type:</div>
      <el-select v-model="query.type" placeholder="Select">
        <el-option
          v-for="item in typeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <!-- table content -->
    <div class="mt-5">
      <el-table
        class="wordbreak-bread-word"
        :data="tableData"
        :default-sort="{ prop: 'number', order: 'descending' }"
        @sort-change="handleSortChange"
        border
      >
        <el-table-column prop="number" header-align="center" align="center"  label="Number" sortable width="110" />
        <el-table-column prop="name" header-align="center" label="Name" width="150">
          <template #default="scope">
            <el-link type="primary" @click="handleShowDetail(scope.row.id)">{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="attack" header-align="center" align="center" label="Attack" minWidth="100" sortable/>
        <el-table-column prop="defense" header-align="center" align="center" label="Defense" minWidth="110" sortable/>
        <el-table-column prop="hp" header-align="center" align="center" label="HP" minWidth="70" sortable/>
        <el-table-column prop="generation" header-align="center" align="center" minWidth="100" label="Generation"/>
        <el-table-column prop="legendary" header-align="center" align="center" minWidth="100" label="Legendary"/>
        <el-table-column prop="sp_atk" header-align="center" align="center" minWidth="100" label="sp_atk" sortable/>
        <el-table-column prop="sp_def" header-align="center" align="center" minWidth="100" label="sp_def" sortable/>
        <el-table-column prop="speed" header-align="center" align="center" minWidth="100" label="Speed" sortable/>
        <el-table-column prop="total" header-align="center" align="center" minWidth="100" label="Total" sortable/>
        <el-table-column prop="type" header-align="center" align="center" minWidth="150" label="Type">
          <template #default="scope">
            <div>{{ getTypeName(scope.row) }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
          class="mt-5"
          v-model:current-page="query.pageNumber"
          v-model:page-size="query.pageSize"
          :page-sizes="[10, 50, 100]"
          :small="false"
          background
          layout="sizes, prev, pager, next"
          :total="totalItems"
        />
      </div>
    </div>
  </div>
  <Spinner :loading="loading"/>
  <PokemonDetailPopup v-if="popup.isShowPopup" :isShowPopup="popup.isShowPopup" @update:isShowPopup="popup.isShowPopup = $event" :pokemonId="popup.pokemonId" :typeList="typeList"/>
  <router-view />
</template>

<script>
import { reactive, toRefs, computed, onMounted, watch } from "vue";
import Spinner from '@/components/Spinner';
import PokemonDetailPopup from '@/components/Popup/PokemonDetailPopup';
import { getPokemons, getType } from '@/api/v1/pokemons';
import { scrollToTop } from '@/utils'

export default {
  components: {
    Spinner,
    PokemonDetailPopup,
  },
  setup() {
    const state = reactive({
      query: {
        pageSize: 10,
        pageNumber: 1,
        sort: {
          field: 'number',
          desc: false,
        },
        type: '',
      },
      totalItems: 0,
      typeList: [],
      tableData: [],
      loading: false,
      popup: {
        isShowPopup: false,
        pokemonId: null,
      }
    });


    /**
     * getList
     * @author HaoDT
     */
    const getList = async () => {
      try {
        state.loading = true;
        const { data: { data: resultType }} = await getType();
        state.typeList = resultType;
        const { data: result } = await getPokemons({ 
          'page[number]': state.query.pageNumber, 
          'page[size]': state.query.pageSize, 
          sort: `${state.query.sort.desc ? '-' : ''}${state.query.sort.field}`,
          'filter[type]': state.query.type,
        });
        state.tableData = result?.data;
        state.totalItems = result?.meta?.total;
        scrollToTop();
        state.loading = false;
      } catch {
        state.loading = false;
      }
    }

    /**
     * handleSortChange
     * @author HaoDT
     */
    const handleSortChange = (data) => {
      state.query.sort = {
        field: data.prop,
        desc: data.order === 'descending',
      }
    }

    /**
     * getTypeName
     * @author HaoDT
     */
    const getTypeName = (row) => {
      const type = state.typeList.filter(item => [row.type_1, row.type_2].includes(item.id));
      const nameType = [];
      type.forEach(item => nameType.push(item.name));
      return type.length ? nameType.join(', ') : '';
    }

    /**
     * handleShowDetail
     * @author HaoDT
     */
    const handleShowDetail = (pokemonId) => {
      state.popup.pokemonId = pokemonId;
      state.popup.isShowPopup = true;
    }

    onMounted(() => {
      getList();
    });

    watch(
      () => state.query,
      () => {
        getList();
      },
      { deep: true }
    );
    
    return {
      ...toRefs(state),
      handleSortChange,
      getTypeName,
      handleShowDetail,
    };
  },
};
</script>

<style lang="scss">
.wordbreak-bread-word {
  div, span {
    word-break: break-word !important;
  }
}
</style>
