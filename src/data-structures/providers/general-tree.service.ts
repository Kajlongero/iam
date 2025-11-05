import { Injectable } from "@nestjs/common";

export interface TreeNode<T> {
  data: T;
  parent: T | null;
  children: TreeNode<T>[];
}

@Injectable()
export class GeneralTreeService {
  buildTree<
    T extends Record<string, unknown>,
    J extends Record<string, unknown>,
  >(
    flatData: T[],
    parentKey: keyof T,
    dataMapper: (item: T) => J
  ): TreeNode<J>[] {
    const dataMap: Record<string, J> = {};

    const nodeMap: Record<string, TreeNode<J>> = {};

    const idKey: keyof T = "id" as keyof T;

    flatData.forEach((item) => {
      const nodeData: J = dataMapper(item);
      dataMap[String(item[idKey])] = nodeData;

      nodeMap[String(item[idKey])] = {
        data: nodeData,
        parent: null,
        children: [],
      };
    });

    const tree: TreeNode<J>[] = [];

    flatData.forEach((item) => {
      const currentId: string = String(item[idKey]);
      const parentId = item[parentKey] as string | null | undefined;

      const currentNode = nodeMap[currentId];

      if (parentId !== null && parentId !== undefined && nodeMap[parentId]) {
        const parentNode = nodeMap[parentId];

        currentNode.parent = parentNode.data;

        parentNode.children.push(currentNode);
      } else {
        tree.push(currentNode);
      }
    });

    return tree;
  }
}
