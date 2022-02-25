//@ts-nocheck
export const categoryFilter = (array: Array<any>, category: string, level: number) => {
  const headerCategories = [];
  const RESOURCE_CAPABILITY = array.filter(levels => {
    return levels['name'] === category;
  });

  let CAPACITY_CONCAT_OPTIONS = RESOURCE_CAPABILITY.map(item => {
    const { weightingRange, options } = item;
    return options.map(subItem => {
      return {
        ...subItem,
        weightingRange,
      };
    });
  }).flat();

  CAPACITY_CONCAT_OPTIONS = CAPACITY_CONCAT_OPTIONS.filter(designation => designation.groupRequirement != true);
  const UNIQUE_GROUPPED_ITEMS = CAPACITY_CONCAT_OPTIONS.map(item => {
    const requirementID = item['requirement-id'];
    const { name, groups, weightingRange } = item;
    const groupname = name;
    return groups.map(group => {
      return {
        ...group,
        groupname,
        weightingRange,
        requirementID,
      };
    });
  }).flat();
  const UNIQUE_DESIGNATION_CATEGORY = [...new Set(UNIQUE_GROUPPED_ITEMS.map(item => item.name))];
  const CATEGORIZED_ACCORDING_DESIGNATION = [];
  for (const category of UNIQUE_DESIGNATION_CATEGORY) {
    const FINDRELEVANTCATEGORY = UNIQUE_GROUPPED_ITEMS.filter(item => {
      return item.name == category;
    });
    const Weightage = FINDRELEVANTCATEGORY?.[0]?.weightingRange;
    const MAPPEDACCORDINGTOCATEGORY = {
      category,
      data: FINDRELEVANTCATEGORY,
      Weightage: Weightage,
    };
    CATEGORIZED_ACCORDING_DESIGNATION.push(MAPPEDACCORDINGTOCATEGORY);
  }
  let LevelDesignationStorageForHeadings = [];
  for (const desgination of CATEGORIZED_ACCORDING_DESIGNATION) {
    const { Weightage, data, category } = desgination;
    const filteredLevelContent = data.filter(role => role.level === level);
    const ReformedObject = {
      Weightage,
      data: filteredLevelContent,
      category,
    };
    LevelDesignationStorageForHeadings.push(ReformedObject);
  }
  LevelDesignationStorageForHeadings = LevelDesignationStorageForHeadings.filter(
    designation => designation.data.length !== 0,
  );
  const TableHeadings = LevelDesignationStorageForHeadings.map((item, index) => {
    headerCategories.push(item.category);
    return {
      url: `#section${index}`,
      text: item.category,
      subtext: `${item.Weightage.min}% / ${item.Weightage.max}%`,
    };
  });
  /**
   * Removing duplicated designations
   */
  const REMOVED_DUPLICATED_JOB = CATEGORIZED_ACCORDING_DESIGNATION.map(item => {
    const { Weightage, data, category } = item;
    const UNIQUESET = [...new Set(data.map(item => item.groupname))];
    const JOBSTORAGE = [];
    for (const uniqueItem of UNIQUESET) {
      const filteredContents = data.filter(designation => designation.groupname === uniqueItem)[0];
      JOBSTORAGE.push(filteredContents);
    }
    return { Weightage, data: JOBSTORAGE.flat(), category };
  });
  /**
   * Levels 1 designaitons
   */
  let LevelDesignationStorage = [];

  for (const desgination of REMOVED_DUPLICATED_JOB) {
    const { Weightage, data, category } = desgination;
    const filteredLevel1Content = data;
    const ReformedObject = {
      Weightage,
      data: filteredLevel1Content,
      category,
    };
    LevelDesignationStorage.push(ReformedObject);
  }

  LevelDesignationStorage = LevelDesignationStorage.filter(designation => designation.data.length !== 0);

  const RESOURCE_CAPABILITIES = array.filter(dimension => {
    return dimension['dimension-id'] === 7;
  });
  //console.log('RESOURCE_CAPABILITIES ', RESOURCE_CAPABILITIES);
  const RESOURCE_CAPABILITIES_OPTIONS = RESOURCE_CAPABILITIES.map(item => {
    const { options } = item;
    return options;
  }).flat();

  const RESOURCE_CAPABILITIES_GROUPS = RESOURCE_CAPABILITIES_OPTIONS.map(item => {
    const requirementID = item['requirement-id'];
    const { name, groups } = item;
    const subgroupName = name;
    return groups.map(group => {
      const { name } = group;
      return {
        subheader: name,
        subgroup: subgroupName,
        requirementID: requirementID,
      };
    });
  }).flat();

  // const RESOURCE_CAPABILITIES_CATEGORIES_BY_GROUPS = RESOURCE_CAPABILITIES_GROUPS.map((item, index) => {
  //   const requirementID = item['requirement-id'];
  //   const { subgroup, subheader, requirementID } = item;
  //   if (subheader === headerCategories[index]) {
  //     return item.map(cat => {});
  //      }
  //   // return groups.map(group => {
  //   //   const { name } = group;
  //   //   return {
  //   //     subheader: name,
  //   //     subgroup: subgroupName,
  //   //     requirementID: requirementID,
  //   //   };
  //   // });
  // }).flat();
  // const duplicate = seen.has(el.subgroup);
  // seen.add(el.subgroup);
  // return !duplicate;
  const seen = new Set();
  const UNIQUE_RESOURCE_CAPABILITIES_GROUPS = RESOURCE_CAPABILITIES_GROUPS.filter(el => {
    const duplicate = seen.has(el.subgroup);
    seen.add(el.subgroup);
    return !duplicate;
  });
  //console.log('RESOURCE_CAPABILITIES_GROUPS cat1 ', RESOURCE_CAPABILITIES_GROUPS);
  //console.log('UNIQUE_RESOURCE_CAPABILITIES_GROUPS cat2 ', UNIQUE_RESOURCE_CAPABILITIES_GROUPS);

  const catagoriesSubheaders = [];
  const subgroups = [];
  // UNIQUE_RESOURCE_CAPABILITIES_GROUPS.reduce((accumulator, cat1, i) => {
  //   const subgroup1 = cat1.subgroup;
  //   const subheader1 = cat1.subheader;
  //   const requirementID1 = cat1.requirementID;
  //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx i ', i);
  //   RESOURCE_CAPABILITIES_GROUPS.map((cat2, j) => {
  //     const subgroup2 = cat2.subgroup;
  //     const subheader2 = cat2.subheader;
  //     const requirementID2 = cat2.requirementID;
  //     if (subheader1 !== subheader2 && subgroup1 === subgroup2 && requirementID1 === requirementID2) {
  //       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx j ', j);
  //       subgroups.push(subgroup1);
  //       accumulator.push({
  //         subheader: subheader1,
  //         subgroup: subheader2,
  //         subgroupItems: subgroups,
  //       });
  //       return accumulator;
  //     }
  //     return accumulator;
  //   });
  //   return accumulator;
  // }, []);

  //console.log(UNIQUE_RESOURCE_CAPABILITIES_GROUPS);
  if (level === 1) {
    return [TableHeadings, LevelDesignationStorage];
  }
  return null; //dimensionsSubCategories;
};
