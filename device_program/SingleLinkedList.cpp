#include "SingleLinkedList.h"

SingleLinkedList::SingleLinkedList(int length) : maxLength{length}{}

void SingleLinkedList::add(float value){
    if (this->length == 0) {
        Node* node = new Node(value);
        this->head = node;
    } else if (this->length == 1) {
        Node* node = new Node(value);
        this->head->addToTail(node);
        this->tail = node;
    } else if (this->length != this->maxLength) {
        Node* node = new Node(value);
        this->tail->addToTail(node);
        this->tail = node;
    } else {
        Node* node = new Node(value);
        this->tail->addToTail(node);
        this->tail = node;

        Node* oldHead = this->head;
        this->totalValue -= oldHead->value;
        this->head = oldHead->tail;

        delete oldHead;

        --this->length;
        
    }
    ++this->length;
    this->totalValue += value;
}


float SingleLinkedList::average(){
    return this->totalValue / this->length;
}

bool SingleLinkedList::full(){
    return this->length == this->maxLength;
}


Node::Node(float value) : value{value} {}

void Node::addToTail(Node* node){
    this->tail = node;
}

