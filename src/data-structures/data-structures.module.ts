import { Module } from "@nestjs/common";
import { GeneralTreeService } from "./providers/general-tree.service";

@Module({
  exports: [GeneralTreeService],
  providers: [GeneralTreeService],
})
export class DataStructuresModule {}
