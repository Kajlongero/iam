import { Injectable } from "@nestjs/common";
import { CompareHierarchy } from "../interfaces/general-tree.interface";

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

  findNodeById<T extends { id: string }>(id: string, tree: TreeNode<T>) {
    if (!tree) return null;

    if (tree.data?.id === id) return tree.data;

    for (const node of tree.children) {
      const foundNode = this.findNodeById(id, node) as TreeNode<T>;

      if (foundNode) return foundNode;
    }

    return null;
  }

  isNodeHigherThan<T extends { id: string }>(data: CompareHierarchy<T>) {
    const { list, strict, parentKey, superiorId, inferiorId } = data;

    if (superiorId === inferiorId) return !strict;

    const idToMap = new Map<string, T>(list.map((value) => [value.id, value]));

    const inferior = idToMap.get(inferiorId);
    if (!inferior) return false;

    let currentParentId = inferior[parentKey] as string | null | undefined;

    while (currentParentId) {
      if (currentParentId === superiorId) return true;

      const parentRole = idToMap.get(currentParentId);
      if (!parentRole || !parentRole[parentKey]) break;

      currentParentId = parentRole[parentKey] as string | null | undefined;
    }

    return false;
  }
}
