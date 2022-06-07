import { objectType } from "nexus"

export const Task = objectType({
  name: "Task",
  definition(t) {
      t.nonNull.int("id");
      t.nonNull.int("position");
      t.nonNull.string("title");
      t.nonNull.boolean("status"); // Use true, false to indicate completion of the task: true -> finished
  },
})
